'use client';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '@chakra/theme';
import { useEffect, useState } from 'react';
import { RecoilRoot } from 'recoil';

type Props = {
    children: React.ReactNode;
};

const Providers = ({ children }: Props) => {
    const [showing, setShowing] = useState(false);

    useEffect(() => {
        setShowing(true);
    }, []);

    if (!showing) {
        return null;
    }

    if (typeof window === 'undefined') {
        return <></>;
    }
    return (
        <RecoilRoot>
            <ChakraProvider theme={theme}>{children}</ChakraProvider>
        </RecoilRoot>
    );
};

export default Providers;
