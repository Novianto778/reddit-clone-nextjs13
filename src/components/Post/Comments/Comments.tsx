'use client';
import { Post, postState } from '@atoms/postsAtom';
import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import {
    Box,
    Flex,
    SkeletonCircle,
    SkeletonText,
    Stack,
    Text,
} from '@chakra-ui/react';
import CommentInput from './CommentInput';
import {
    collection,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    where,
    writeBatch,
} from 'firebase/firestore';
import { firestore } from '@firebase/clientApp';
import { useSetRecoilState } from 'recoil';
import CommentItem from './CommentItem';

type Props = {
    user: User;
    selectedPost: Post | null;
    communityId: string;
};

export type Comment = {
    id?: string;
    creatorId: string;
    creatorDisplayText: string;
    communityId: string;
    postId: string;
    postTitle: string;
    text: string;
    createdAt?: Timestamp;
};

const Comments = ({ user, selectedPost, communityId }: Props) => {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentFetchLoading, setCommentFetchLoading] = useState(true);
    const [commentCreateLoading, setCommentCreateLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState('');
    const setPostState = useSetRecoilState(postState);

    const onCreateComment = async (commentText: string) => {
        setCommentCreateLoading(true);
        try {
            const batch = writeBatch(firestore);

            // Create comment document
            const commentDocRef = doc(collection(firestore, 'comments'));

            const newComment: Comment = {
                id: commentDocRef.id,
                postId: selectedPost?.id!,
                creatorId: user.uid,
                creatorDisplayText: user.email!.split('@')[0],
                communityId,
                text: commentText,
                postTitle: selectedPost?.title!,
                createdAt: serverTimestamp() as Timestamp,
            };

            batch.set(commentDocRef, newComment);
            newComment.createdAt = {
                seconds: Date.now() / 1000,
            } as Timestamp;
            // Update post numberOfComments
            const postDocRef = doc(firestore, 'posts', selectedPost?.id!);
            batch.update(postDocRef, {
                numberOfComments: selectedPost?.numberOfComments! + 1,
            });
            await batch.commit();

            // update client recoil state
            setComment('');
            setComments((prev) => [newComment, ...prev]);
            setPostState((prev) => ({
                ...prev,
                selectedPost: {
                    ...prev.selectedPost,
                    numberOfComments: prev.selectedPost?.numberOfComments! + 1,
                } as Post,
            }));
        } catch (error) {
            console.log('Error creating comment', error);
        }
        setCommentCreateLoading(false);
    };

    const onDeleteComment = async (comment: any) => {
        setDeleteLoading(comment.id);
        try {
            const batch = writeBatch(firestore);

            // Delete comment document
            const commentDocRef = doc(
                collection(firestore, 'comments'),
                comment.id
            );
            batch.delete(commentDocRef);

            // Update post numberOfComments
            const postDocRef = doc(firestore, 'posts', selectedPost?.id!);
            batch.update(postDocRef, {
                numberOfComments: selectedPost?.numberOfComments! - 1,
            });
            await batch.commit();

            // update client recoil state
            setComments((prev) =>
                prev.filter((item) => item.id !== comment.id)
            );
            setPostState((prev) => ({
                ...prev,
                selectedPost: {
                    ...prev.selectedPost,
                    numberOfComments: prev.selectedPost?.numberOfComments! - 1,
                } as Post,
            }));
        } catch (error) {
            console.log('Error deleting comment', error);
        }
        setDeleteLoading('');
    };

    const getPostComments = async () => {
        try {
            const commentsQuery = query(
                collection(firestore, 'comments'),
                where('postId', '==', selectedPost?.id),
                orderBy('createdAt', 'desc')
            );

            const commentDocs = await getDocs(commentsQuery);
            const comments = commentDocs.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setComments(comments as Comment[]);
        } catch (error: any) {
            console.log('getPostComments error', error.message);
        }
        setCommentFetchLoading(false);
    };

    useEffect(() => {
        if (!selectedPost?.id) return;
        getPostComments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPost?.id]);

    return (
        <Box bg="white" p={2} borderRadius="0px 0px 4px 4px">
            <Flex
                direction="column"
                pl={10}
                pr={4}
                mb={6}
                fontSize="10pt"
                width="100%"
            >
                <CommentInput
                    comment={comment}
                    setComment={setComment}
                    loading={commentCreateLoading}
                    user={user}
                    onCreateComment={onCreateComment}
                />
            </Flex>
            <Stack spacing={6} p={2}>
                {commentFetchLoading ? (
                    <>
                        {[0, 1, 2].map((item) => (
                            <Box key={item} padding="6" bg="white">
                                <SkeletonCircle size="10" />
                                <SkeletonText
                                    mt="4"
                                    noOfLines={2}
                                    spacing="4"
                                />
                            </Box>
                        ))}
                    </>
                ) : (
                    <>
                        {!!comments.length ? (
                            <>
                                {comments.map((item: Comment) => (
                                    <CommentItem
                                        key={item.id}
                                        comment={item}
                                        onDeleteComment={onDeleteComment}
                                        isLoading={
                                            deleteLoading ===
                                            (item.id as string)
                                        }
                                        userId={user?.uid}
                                    />
                                ))}
                            </>
                        ) : (
                            <Flex
                                direction="column"
                                justify="center"
                                align="center"
                                borderTop="1px solid"
                                borderColor="gray.100"
                                p={20}
                            >
                                <Text fontWeight={700} opacity={0.3}>
                                    No Comments Yet
                                </Text>
                            </Flex>
                        )}
                    </>
                )}
            </Stack>
        </Box>
    );
};

export default Comments;
