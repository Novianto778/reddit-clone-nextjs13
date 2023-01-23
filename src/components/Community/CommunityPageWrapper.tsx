'use client';
import { Community, communityState } from '@atoms/communitiesAtom';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

type Props = {
    children: React.ReactNode;
    communityData: Community;
};

const CommunityPageWrapper = ({ children, communityData }: Props) => {
    const setCommunityStateValue = useSetRecoilState(communityState);

    useEffect(() => {
        setCommunityStateValue((prev) => ({
            ...prev,
            currentCommunity: communityData,
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [communityData]);

    return <>{children}</>;
};

export default CommunityPageWrapper;
