import { authModalState } from '@atoms/authModalAtom';
import { Button } from '@chakra-ui/react';
import { useSetRecoilState } from 'recoil';

type Props = {};

const AuthButtons = (props: Props) => {
    const setAuthModalState = useSetRecoilState(authModalState);
    return (
        <>
            <Button
                variant="outline"
                height="28px"
                display={{
                    base: 'none',
                    sm: 'flex',
                }}
                width={{
                    base: '70px',
                    md: '110px',
                }}
                mr={2}
                onClick={() =>
                    setAuthModalState((prev) => ({
                        ...prev,
                        open: true,
                        view: 'login',
                    }))
                }
            >
                Log In
            </Button>
            <Button
                height="28px"
                display={{
                    base: 'none',
                    sm: 'flex',
                }}
                width={{
                    base: '70px',
                    md: '110px',
                }}
                mr={2}
                onClick={() =>
                    setAuthModalState((prev) => ({
                        ...prev,
                        open: true,
                        view: 'signup',
                    }))
                }
            >
                Sign Up
            </Button>
        </>
    );
};

export default AuthButtons;
