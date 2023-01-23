'use client';
import { Community } from '@atoms/communitiesAtom';
import { Post } from '@atoms/postsAtom';
import { Stack } from '@chakra-ui/react';
import { auth, firestore } from '@firebase/clientApp';
import usePosts from '@hooks/usePosts';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import PostItem from './PostItem';
import PostLoader from './PostLoader';

type Props = {
    communityData: Community;
    // userId?: string;
};

const Posts = ({ communityData }: Props) => {
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(false);
    const {
        postStateValue,
        setPostStateValue,
        onVote,
        onDeletePost,
        onSelectPost,
    } = usePosts();

    const getPosts = async () => {
        try {
            setLoading(true);
            const postsQuery = query(
                collection(firestore, 'posts'),
                where('communityId', '==', communityData.id),
                orderBy('createdAt', 'desc')
            );
            const postDocs = await getDocs(postsQuery);
            const posts = postDocs.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPostStateValue((prev) => ({
                ...prev,
                posts: posts as Post[],
            }));
        } catch (error: any) {
            console.log('getPosts error: ', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        getPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            {loading ? (
                <PostLoader />
            ) : (
                <Stack>
                    {postStateValue.posts.map((post) => {
                        return (
                            <PostItem
                                key={post.id}
                                userIsCreator={user?.uid === post.creatorId}
                                post={post}
                                onDeletePost={onDeletePost}
                                onSelectPost={onSelectPost}
                                onVote={onVote}
                                userVoteValue={
                                    postStateValue.postVotes.find(
                                        (vote) => vote.postId === post.id
                                    )?.voteValue
                                }
                            />
                        );
                    })}
                </Stack>
            )}
        </>
    );
};

export default Posts;
