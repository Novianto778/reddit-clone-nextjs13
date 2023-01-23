import { authModalState } from '@atoms/authModalAtom';
import { communityState } from '@atoms/communitiesAtom';
import { Post, postState, PostVote } from '@atoms/postsAtom';
import { auth, firestore, storage } from '@firebase/clientApp';
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
    writeBatch,
} from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useRouter } from 'next/navigation';
const usePosts = () => {
    const router = useRouter();
    const [user] = useAuthState(auth);
    const [postStateValue, setPostStateValue] = useRecoilState(postState);
    const setAuthModalState = useSetRecoilState(authModalState);
    const currentCommunity = useRecoilValue(communityState).currentCommunity;

    const onVote = async (
        e: React.MouseEvent,
        post: Post,
        vote: number,
        communityId: string
    ) => {
        e.stopPropagation();
        // check for a user => if not open auth modal
        if (!user?.uid) {
            setAuthModalState({ open: true, view: 'login' });
            return;
        }
        try {
            const { voteStatus } = post;
            const existingVote = postStateValue.postVotes.find(
                (vote) => vote.postId === post.id
            );
            const batch = writeBatch(firestore);
            const updatedPost = { ...post };
            const updatedPosts = [...postStateValue.posts];
            let updatedPostVotes = [...postStateValue.postVotes];
            let voteChange = vote;

            if (!existingVote) {
                // New vote - they have not voted on the post before
                const postVoteRef = doc(
                    collection(firestore, 'users', `${user!.uid}/postVotes`)
                );

                const newVote: PostVote = {
                    id: postVoteRef.id,
                    postId: post.id!,
                    communityId,
                    voteValue: vote,
                };

                batch.set(postVoteRef, newVote);

                console.log('NEW VOTE!!!', newVote);
                // add/substract 1 to/from post.voteStatus
                updatedPost.voteStatus = voteStatus + vote;
                // create a new postVote document
                updatedPostVotes = [...updatedPostVotes, newVote];
            }
            // Existing vote - they have voted on the post before
            else {
                const postVoteRef = doc(
                    firestore,
                    'users',
                    `${user!.uid}/postVotes/${existingVote.id}`
                );

                // Removing vote
                // removing their vote (up => neutral, down => neutral)
                if (existingVote.voteValue === vote) {
                    // add/substract 1 to/from post.voteStatus
                    updatedPost.voteStatus = voteStatus - vote;

                    // delete postVote document
                    updatedPostVotes = updatedPostVotes.filter(
                        (vote) => vote.id !== existingVote.id
                    );
                    batch.delete(postVoteRef);
                    voteChange *= -1; // akan jadi kebalikannya, ketika dari up ke down, maka voteChange = -1, jadi -1 * -1 = 1, jadi voteStatus akan bertambah 1
                }
                // flipping their vote (up => down, down => up)
                else {
                    // add/substract 2 to/from post.voteStatus
                    updatedPost.voteStatus = voteStatus + 2 * vote; // ketika dari up ke down, maka voteStatus akan bertambah 2, jadi voteStatus = voteStatus + 2 * vote

                    const voteIdx = updatedPostVotes.findIndex(
                        (vote) => vote.id === existingVote.id
                    );
                    updatedPostVotes[voteIdx] = {
                        ...existingVote,
                        voteValue: vote,
                    };

                    // update postVote document
                    batch.update(postVoteRef, {
                        voteValue: vote,
                    });
                    voteChange = 2 * vote;
                }
            }
            const postIdx = updatedPosts.findIndex((p) => p.id === post.id);
            updatedPosts[postIdx] = updatedPost;
            // update recoil state
            setPostStateValue((prev) => ({
                ...prev,
                posts: updatedPosts,
                postVotes: updatedPostVotes,
            }));

            if (postStateValue.selectedPost) {
                setPostStateValue((prev) => ({
                    ...prev,
                    selectedPost: updatedPost,
                }));
            }

            const postRef = doc(firestore, 'posts', post.id!);
            batch.update(postRef, {
                voteStatus: voteStatus + voteChange,
            });
            await batch.commit();
        } catch (error: any) {
            console.log('Error voting on post', error);
        }
    };

    const onSelectPost = async (post: Post) => {
        setPostStateValue((prev) => ({
            ...prev,
            selectedPost: post,
        }));
        router.push(`/r/${post.communityId}/comments/${post.id}`);
    };

    const onDeletePost = async (post: Post): Promise<boolean> => {
        try {
            // check if image exists, if so delete it
            if (post.imageURL) {
                const imageRef = ref(storage, `posts/${post.id}/image`);
                await deleteObject(imageRef);
            }
            // delete post from firestore
            const postDocRef = doc(firestore, 'posts', post.id!);
            await deleteDoc(postDocRef);
            // update recoil state
            setPostStateValue((prev) => ({
                ...prev,
                posts: prev.posts.filter((p) => p.id !== post.id),
            }));
        } catch (error: any) {
            return false;
        }
        return true;
    };

    const getCommunityPostVotes = async (communityId: string) => {
        const postVotesQuery = query(
            collection(firestore, `users/${user?.uid}/postVotes`),
            where('communityId', '==', communityId)
        );
        const postVoteDocs = await getDocs(postVotesQuery);
        const postVotes = postVoteDocs.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setPostStateValue((prev) => ({
            ...prev,
            postVotes: postVotes as PostVote[],
        }));
    };

    useEffect(() => {
        if (!user?.uid || !currentCommunity) return;
        getCommunityPostVotes(currentCommunity.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, currentCommunity]);

    useEffect(() => {
        // Logout or no authenticated user
        if (!user?.uid) {
            setPostStateValue((prev) => ({
                ...prev,
                postVotes: [],
            }));
            return;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return {
        postStateValue,
        setPostStateValue,
        onVote,
        onSelectPost,
        onDeletePost,
    };
};

export default usePosts;
