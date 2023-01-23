'use client';
import { Flex, Spinner } from '@chakra-ui/react';
import React from 'react';

type Props = {};

const Loading = (props: Props) => {
    return (
        <Flex width="100vw" height="100vh" justify="center" align="center">
            <Spinner color="red.500" size={'xl'} />
        </Flex>
    );
};

export default Loading;
