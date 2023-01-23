import { authModalState } from '@atoms/authModalAtom';
import { Button, Flex, Input, Text } from '@chakra-ui/react';
import { auth, firestore } from '@firebase/clientApp';
import { FIREBASE_ERRORS } from '@firebase/errors';
import { User } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useSetRecoilState } from 'recoil';

type Props = {};

const SignUp = (props: Props) => {
    const setAuthModalState = useSetRecoilState(authModalState);
    const [signupForm, setSignupForm] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [formError, setFormError] = useState('');

    const [createUserWithEmailAndPassword, userCred, loading, userError] =
        useCreateUserWithEmailAndPassword(auth);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError('');
        if (userError)
            setFormError(
                FIREBASE_ERRORS[
                    userError.message as keyof typeof FIREBASE_ERRORS
                ]
            );
        if (signupForm.password !== signupForm.confirmPassword) {
            setFormError('passwords do not match');
            return;
        }
        createUserWithEmailAndPassword(signupForm.email, signupForm.password);
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSignupForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const createUserDocument = async (user: User) => {
        await addDoc(
            collection(firestore, 'users'),
            JSON.parse(JSON.stringify(user))
        );
    };

    useEffect(() => {
        if (userCred) {
            createUserDocument(userCred.user);
        }
    }, [userCred]);

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
                bg="gray.50"
            />
            <Input
                required
                name="password"
                placeholder="password"
                type="password"
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
                bg="gray.50"
            />
            <Input
                required
                name="confirmPassword"
                placeholder="confirm password"
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
                bg="gray.50"
            />
            {formError && (
                <Text textAlign="center" fontSize="10pt" color="red" mt={2}>
                    {formError}
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
                Sign Up
            </Button>
            <Flex fontSize="9pt" justifyContent="center">
                <Text mr={1}>Already a redditor?</Text>
                <Text
                    color="blue.500"
                    fontWeight={700}
                    cursor="pointer"
                    onClick={() =>
                        setAuthModalState((prev) => ({
                            ...prev,
                            view: 'login',
                        }))
                    }
                >
                    LOG IN
                </Text>
            </Flex>
        </form>
    );
};

export default SignUp;
