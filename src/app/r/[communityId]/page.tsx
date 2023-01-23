import { Community } from '@atoms/communitiesAtom';
import About from '@components/Community/About';
import CommunityPageWrapper from '@components/Community/CommunityPageWrapper';
import CreatePostLink from '@components/Community/CreatePostLink';
import Header from '@components/Community/Header';
import PageContent from '@components/Layout/PageContent';
import Posts from '@components/Post/Posts';
import { firestore } from '@firebase/clientApp';
import { doc, getDoc } from 'firebase/firestore';
import { notFound } from 'next/navigation';

type Props = {
    params: {
        communityId: string;
    };
};

const getCommunityData = async (communityId: string) => {
    try {
        const communityDocRef = doc(firestore, 'communities', communityId);
        const communityDoc = await getDoc(communityDocRef);
        if (!communityDoc.exists()) return null;
        return { id: communityDoc.id, ...communityDoc.data() } as Community;
    } catch (error) {
        console.error(error);
    }
};

const CommunityPage = async ({ params: { communityId } }: Props) => {
    const communityData = await getCommunityData(communityId);
    const serializedCommunityData = JSON.parse(JSON.stringify(communityData));
    if (!communityData) return notFound();

    return (
        <CommunityPageWrapper communityData={serializedCommunityData}>
            <Header communityData={serializedCommunityData} />
            <PageContent>
                <>
                    <CreatePostLink communityId={communityId} />
                    <Posts communityData={serializedCommunityData} />
                </>
                <>
                    <About communityData={serializedCommunityData} />
                </>
            </PageContent>
        </CommunityPageWrapper>
    );
};

export default CommunityPage;
