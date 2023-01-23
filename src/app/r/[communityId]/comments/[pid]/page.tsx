'use client';
import { Post } from '@atoms/postsAtom';
import About from '@components/Community/About';
import PageContent from '@components/Layout/PageContent';
import Comments from '@components/Post/Comments/Comments';
import PostItem from '@components/Post/PostItem';
import { auth, firestore } from '@firebase/clientApp';
import useCommunityData from '@hooks/useCommunityData';
import usePosts from '@hooks/usePosts';
import { getDoc, doc } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

type Props = {
    params: {
        pid: string;
        communityId: string;
    };
};

const CommentsPage = ({ params }: Props) => {
    const [user] = useAuthState(auth);
    const { postStateValue, setPostStateValue, onDeletePost, onVote } =
        usePosts();
    const { communityStateValue } = useCommunityData(params);

    const fetchPost = async (postId: string) => {
        try {
            const post = await getDoc(doc(firestore, 'posts', postId));
            if (post.exists()) {
                setPostStateValue((prev) => ({
                    ...prev,
                    selectedPost: { id: post.id, ...post.data() } as Post,
                }));
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.log('Error fetching post', error);
        }
    };

    useEffect(() => {
        if (params.pid && !postStateValue.selectedPost) {
            fetchPost(params.pid);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.pid, postStateValue.selectedPost]);

    return (
        <PageContent>
            <>
                {postStateValue.selectedPost && (
                    <PostItem
                        onDeletePost={onDeletePost}
                        post={postStateValue.selectedPost}
                        onVote={onVote}
                        userVoteValue={
                            postStateValue.postVotes.find(
                                (item) =>
                                    item.postId ===
                                    postStateValue.selectedPost?.id
                            )?.voteValue
                        }
                        userIsCreator={
                            user?.uid === postStateValue.selectedPost?.creatorId
                        }
                    />
                )}

                {user && (
                    <Comments
                        user={user}
                        selectedPost={postStateValue.selectedPost}
                        communityId={postStateValue.selectedPost?.communityId!}
                    />
                )}
            </>
            <>
                <About communityData={communityStateValue.currentCommunity} />
            </>
        </PageContent>
    );
};

export default CommentsPage;
