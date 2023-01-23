'use client';
import { communityState } from '@atoms/communitiesAtom';
import { Post, PostVote } from '@atoms/postsAtom';
import { Stack } from '@chakra-ui/react';
import PersonalHome from '@components/Community/PersonalHome';
import Premium from '@components/Community/Premium';
import Recommendations from '@components/Community/Recommendations';
import PageContent from '@components/Layout/PageContent';
import PostItem from '@components/Post/PostItem';
import PostLoader from '@components/Post/PostLoader';
import { auth, firestore } from '@firebase/clientApp';
import useCommunityData from '@hooks/useCommunityData';
import usePosts from '@hooks/usePosts';
import {
    query,
    collection,
    orderBy,
    limit,
    getDocs,
    DocumentData,
    QuerySnapshot,
    where,
    onSnapshot,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilValue } from 'recoil';

export default function Home() {
    const [user, loadingUser] = useAuthState(auth);
    const {
        postStateValue,
        setPostStateValue,
        onVote,
        onSelectPost,
        onDeletePost,
    } = usePosts();
    const [loading, setLoading] = useState(false);
    const { communityStateValue } = useCommunityData({});

    const buildUserHomeFeed = async () => {
        console.log('GETTING USER FEED');
        setLoading(true);
        try {
            /**
             * if snippets has no length (i.e. user not in any communities yet)
             * do query for 20 posts ordered by voteStatus
             */
            const feedPosts: Post[] = [];

            // User has joined communities
            if (communityStateValue.mySnippets.length) {
                console.log('GETTING POSTS IN USER COMMUNITIES');

                const myCommunityIds = communityStateValue.mySnippets.map(
                    (snippet) => snippet.communityId
                );

                const postQuery = query(
                    collection(firestore, 'posts'),
                    where('communityId', 'in', myCommunityIds),
                    limit(3)
                );

                const postDocs = await getDocs(postQuery);
                const posts = postDocs.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Post[];

                setPostStateValue((prev) => ({
                    ...prev,
                    posts: posts,
                }));

                // Getting 2 posts from 3 communities that user has joined
                // let postPromises: Array<Promise<QuerySnapshot<DocumentData>>> =
                //     [];
                // [0, 1, 2].forEach((index) => {
                //     if (!myCommunityIds[index]) return;

                //     postPromises.push(
                //         getDocs(
                //             query(
                //                 collection(firestore, 'posts'),
                //                 where(
                //                     'communityId',
                //                     '==',
                //                     myCommunityIds[index]
                //                 ),
                //                 limit(3)
                //             )
                //         )
                //     );
                // });
                // const queryResults = await Promise.all(postPromises);
                // /**
                //  * queryResults is an array of length 3, each with 0-2 posts from
                //  * 3 communities that the user has joined
                //  */
                // queryResults.forEach((result) => {
                //     const posts = result.docs.map((doc) => ({
                //         id: doc.id,
                //         ...doc.data(),
                //     })) as Post[];
                //     feedPosts.push(...posts);
                // });
            }
            // User has not joined any communities yet
            else {
                buildNoUserHomeFeed();
            }

            console.log('HERE ARE FEED POSTS', feedPosts);

            // setPostStateValue((prev) => ({
            //     ...prev,
            //     posts: feedPosts,
            // }));

            // if not in any, get 5 communities ordered by number of members
            // for each one, get 2 posts ordered by voteStatus and set these to postState posts
        } catch (error: any) {
            console.log('getUserHomePosts error', error.message);
        }
        setLoading(false);
    };

    const buildNoUserHomeFeed = async () => {
        console.log('GETTING NO USER FEED');
        setLoading(true);
        try {
            const postQuery = query(
                collection(firestore, 'posts'),
                orderBy('voteStatus', 'desc'),
                limit(10)
            );
            const postDocs = await getDocs(postQuery);
            const posts = postDocs.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            console.log('NO USER FEED', posts);

            setPostStateValue((prev) => ({
                ...prev,
                posts: posts as Post[],
            }));
        } catch (error: any) {
            console.log('getNoUserHomePosts error', error.message);
        }
        setLoading(false);
    };

    const getUserPostVotes = () => {
        const postIds = postStateValue.posts.map((post) => post.id);
        const postVotesQuery = query(
            collection(firestore, `users/${user?.uid}/postVotes`),
            where('postId', 'in', postIds)
        );
        const unsubscribe = onSnapshot(postVotesQuery, (querySnapshot) => {
            const postVotes = querySnapshot.docs.map((postVote) => ({
                id: postVote.id,
                ...postVote.data(),
            }));

            setPostStateValue((prev) => ({
                ...prev,
                postVotes: postVotes as PostVote[],
            }));
        });

        return () => unsubscribe();
    };

    useEffect(() => {
        /**
         * initSnippetsFetched ensures that user snippets have been retrieved;
         * the value is set to true when snippets are first retrieved inside
         * of getSnippets in useCommunityData
         */
        if (!communityStateValue.snippetsFetched) return;

        if (user) {
            buildUserHomeFeed();
        }
    }, [user, communityStateValue.snippetsFetched]);

    useEffect(() => {
        if (!user && !loadingUser) buildNoUserHomeFeed();
    }, [user, loadingUser]);

    useEffect(() => {
        if (!user?.uid || !postStateValue.posts.length) return;
        getUserPostVotes();

        // Clear postVotes on dismount
        return () => {
            setPostStateValue((prev) => ({
                ...prev,
                postVotes: [],
            }));
        };
    }, [postStateValue.posts, user?.uid]);

    return (
        <PageContent>
            <>
                {loading ? (
                    <PostLoader />
                ) : (
                    <Stack>
                        {postStateValue.posts.map((post: Post, index) => (
                            <PostItem
                                key={post.id}
                                post={post}
                                // postIdx={index}
                                onVote={onVote}
                                onDeletePost={onDeletePost}
                                userVoteValue={
                                    postStateValue.postVotes.find(
                                        (item) => item.postId === post.id
                                    )?.voteValue
                                }
                                userIsCreator={user?.uid === post.creatorId}
                                onSelectPost={onSelectPost}
                                homePage
                            />
                        ))}
                    </Stack>
                )}
            </>
            <>
                <Stack spacing={5} position="sticky" top="14px">
                    <Recommendations />
                    <Premium />
                    <PersonalHome />
                </Stack>
            </>
        </PageContent>
    );
}
