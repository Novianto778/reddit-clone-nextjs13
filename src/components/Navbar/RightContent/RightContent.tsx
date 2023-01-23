import { Flex, Button } from '@chakra-ui/react';
import AuthModal from '@components/Modal/Auth/AuthModal';
import AuthButtons from './AuthButtons';
import { signOut, User } from 'firebase/auth';
import { auth } from '@firebase/clientApp';
import ActionIcons from '../Icons';
import UserMenu from './UserMenu';

type Props = {
    user?: User | null;
};

const RightContent = ({ user }: Props) => {
    return (
        <>
            <AuthModal />
            <Flex justify="center" align="center">
                {user ? <ActionIcons /> : <AuthButtons />}
                <UserMenu user={user} />
            </Flex>
        </>
    );
};

export default RightContent;
