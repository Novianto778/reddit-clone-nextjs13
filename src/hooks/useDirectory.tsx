import { communityState } from '@atoms/communitiesAtom';
import {
    defaultMenuItem,
    DirectoryMenuItem,
    directoryMenuState,
} from '@components/Navbar/Directory/directoryMenuAtoms';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { FaReddit } from 'react-icons/fa';
import { useRecoilState, useRecoilValue } from 'recoil';

const useDirectory = () => {
    const router = useRouter();
    const [directoryState, setDirectoryState] =
        useRecoilState(directoryMenuState);
    const communityStateValue = useRecoilValue(communityState);
    const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
        setDirectoryState((prev) => ({
            ...prev,
            selectedMenuItem: menuItem,
        }));

        router?.push(menuItem.link);
        if (directoryState.isOpen) {
            toggleMenuOpen();
        }
    };

    const toggleMenuOpen = () => {
        setDirectoryState((prev) => ({
            ...prev,
            isOpen: !directoryState.isOpen,
        }));
    };

    useEffect(() => {
        // const { community } = router.query;

        // const existingCommunity =
        //   communityStateValue.visitedCommunities[community as string];

        const existingCommunity = communityStateValue.currentCommunity;

        if (existingCommunity.id) {
            setDirectoryState((prev) => ({
                ...prev,
                selectedMenuItem: {
                    displayText: `r/${existingCommunity.id}`,
                    link: `r/${existingCommunity.id}`,
                    icon: FaReddit,
                    iconColor: 'blue.500',
                    imageURL: existingCommunity.imageURL,
                },
            }));
            return;
        }
        setDirectoryState((prev) => ({
            ...prev,
            selectedMenuItem: defaultMenuItem,
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [communityStateValue.currentCommunity]);

    return {
        directoryState,
        toggleMenuOpen,
        onSelectMenuItem,
    };
};

export default useDirectory;
