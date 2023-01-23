'use client';
import PageContent from '@components/Layout/PageContent';
import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import NewPostForm from '@components/Post/NewPostForm';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@firebase/clientApp';
import { useRecoilValue } from 'recoil';
import { communityState } from '@atoms/communitiesAtom';
import About from '@components/Community/About';
import useCommunityData from '@hooks/useCommunityData';

type Props = {
    params: {
        communityId: string;
    };
};

const SubmitPost = ({ params }: Props) => {
    const [user] = useAuthState(auth);
    // const communityStateValue = useRecoilValue(communityState);
    const { communityStateValue } = useCommunityData(params);

    return (
        <PageContent>
            <>
                <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
                    <Text fontWeight={600}>Create a post</Text>
                </Box>
                {user && (
                    <NewPostForm user={user} communityId={params.communityId} />
                )}
            </>
            <>
                <About communityData={communityStateValue.currentCommunity} />
            </>
        </PageContent>
    );
};

export default SubmitPost;
