import { MenuItem, Flex, Icon, Box, Text } from '@chakra-ui/react';
import { useState } from 'react';
import CreateCommunityModal from '../../Modal/CreateCommunity/CreateCommunityModal';
import { GrAdd } from 'react-icons/gr';
import { useRecoilValue } from 'recoil';
import { communityState } from '@atoms/communitiesAtom';
import { FaReddit } from 'react-icons/fa';
import MenuListItem from './MenuListItem';
import Moderating from './Moderating';
import MyCommunities from './MyCommunities';

type Props = {};

const Communities = (props: Props) => {
    const [open, setOpen] = useState(false);
    const mySnippets = useRecoilValue(communityState).mySnippets;

    return (
        <div>
            <CreateCommunityModal
                open={open}
                handleClose={() => setOpen(false)}
            />
            <Moderating
                snippets={mySnippets.filter((item) => item.isModerator)}
            />
            <MyCommunities snippets={mySnippets} setOpen={setOpen} />
        </div>
    );
};

export default Communities;
