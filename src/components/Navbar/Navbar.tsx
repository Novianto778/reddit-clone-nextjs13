'use client';
import { auth } from '@firebase/clientApp';
import { Flex, Image } from '@chakra-ui/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import RightContent from './RightContent/RightContent';
import SearchInput from './SearchInput';
import Directory from './Directory/Directory';
import useDirectory from '@hooks/useDirectory';
import { defaultMenuItem } from './Directory/directoryMenuAtoms';
type Props = {};

const Navbar = (props: Props) => {
    const [user] = useAuthState(auth);
    const { onSelectMenuItem } = useDirectory();
    return (
        <Flex
            bg="white"
            height="44px"
            padding="6px 12px"
            justify={{ md: 'space-between' }}
        >
            <Flex
                align="center"
                width={{ base: '40px', md: 'auto' }}
                mr={{ base: 0, md: 2 }}
                onClick={() => onSelectMenuItem(defaultMenuItem)}
            >
                <Image
                    src="/images/redditFace.svg"
                    height="30px"
                    alt="reddit face"
                />
                <Image
                    src="/images/redditText.svg"
                    height="46px"
                    alt="reddit text"
                    display={{ base: 'none', md: 'block' }}
                />
            </Flex>

            {user && <Directory />}
            <SearchInput user={user} />
            <RightContent user={user} />
        </Flex>
    );
};

export default Navbar;
