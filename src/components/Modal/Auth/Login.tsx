import { auth } from '@firebase/clientApp';
import { authModalState } from '@atoms/authModalAtom';
import { Input, Button, Flex, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useSetRecoilState } from 'recoil';
import { FIREBASE_ERRORS } from '@firebase/errors';

type Props = {};

const Login = (props: Props) => {
    const setAuthModalState = useSetRecoilState(authModalState);
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: '',
    });
    const [signInWithEmailAndPassword, user, loading, error] =
        useSignInWithEmailAndPassword(auth);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        signInWithEmailAndPassword(loginForm.email, loginForm.password);
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <form onSubmit={onSubmit}>
            <Input
                required
                name="email"
                placeholder="email"
                type="text"
                mb={2}
                onChange={onChange}
                fontSize="10pt"
                _placeholder={{ color: 'gray.500' }}
                _hover={{
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500',
                }}
                _focus={{
                    outline: 'none',
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500',
                }}
            />
            <Input
                required
                name="password"
                placeholder="password"
                type="password"
                onChange={onChange}
                fontSize="10pt"
                _placeholder={{ color: 'gray.500' }}
                _hover={{
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500',
                }}
                _focus={{
                    outline: 'none',
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500',
                }}
            />
            {error && (
                <Text textAlign="center" fontSize="10pt" color="red" mt={2}>
                    {
                        FIREBASE_ERRORS[
                            error.message as keyof typeof FIREBASE_ERRORS
                        ]
                    }
                </Text>
            )}
            <Button
                width="100%"
                height="36px"
                mb={2}
                mt={2}
                type="submit"
                isLoading={loading}
            >
                Log In
            </Button>
            <Flex fontSize="9pt" justifyContent="center">
                <Text mr={1}>Forgot your password?</Text>
                <Text
                    color="blue.500"
                    fontWeight={700}
                    cursor="pointer"
                    onClick={() =>
                        setAuthModalState((prev) => ({
                            ...prev,
                            view: 'resetPassword',
                        }))
                    }
                >
                    Reset
                </Text>
            </Flex>
            <Flex fontSize="9pt" justifyContent="center">
                <Text mr={1}>New here?</Text>
                <Text
                    color="blue.500"
                    fontWeight={700}
                    cursor="pointer"
                    onClick={() =>
                        setAuthModalState((prev) => ({
                            ...prev,
                            view: 'signup',
                        }))
                    }
                >
                    SIGN UP
                </Text>
            </Flex>
        </form>
    );
};

export default Login;
