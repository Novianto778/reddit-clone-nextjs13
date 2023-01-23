import { Flex, Button, Text, Image } from '@chakra-ui/react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@firebase/clientApp';
import { User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useEffect } from 'react';

type Props = {};

const OAuthButtons = (props: Props) => {
    const [signInWithGoogle, userCred, loading, error] =
        useSignInWithGoogle(auth);

    const createUserDocument = async (user: User) => {
        const userRef = doc(firestore, 'users', user.uid);

        await setDoc(userRef, JSON.parse(JSON.stringify(user)));
    };

    console.log(userCred);

    useEffect(() => {
        if (userCred) {
            createUserDocument(userCred.user);
        }
    }, [userCred]);
    return (
        <Flex direction="column" mb={4} width="100%">
            <Button
                variant="oauth"
                mb={2}
                onClick={() => signInWithGoogle()}
                isLoading={loading}
            >
                <Image
                    src="/images/googlelogo.png"
                    height="20px"
                    mr={4}
                    alt="google icon"
                />
                Continue with Google
            </Button>
            <Button variant="oauth">Some Other Provider</Button>
            {error && (
                <Text textAlign="center" fontSize="10pt" color="red" mt={2}>
                    {error.message}
                </Text>
            )}
        </Flex>
    );
};

export default OAuthButtons;
