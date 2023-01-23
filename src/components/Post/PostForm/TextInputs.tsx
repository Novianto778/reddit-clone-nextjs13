import { Button, Flex, Input, Stack, Textarea } from '@chakra-ui/react';
import React from 'react';
import { TextInputType } from '../NewPostForm';

type Props = {
    textInputs: TextInputType;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    handleCreatePost: () => void;
    loading: boolean;
};

const TextInputs = ({
    textInputs,
    onChange,
    handleCreatePost,
    loading,
}: Props) => {
    return (
        <Stack spacing={3} width="100%">
            <Input
                name="title"
                value={textInputs.title}
                onChange={onChange}
                fontSize="10pt"
                borderRadius={4}
                placeholder="Title"
                _placeholder={{ color: 'gray.500' }}
                _focus={{
                    borderColor: 'black',
                    outline: 'none',
                    border: '1px solid',
                    bg: 'white',
                }}
            />
            <Textarea
                value={textInputs.body}
                onChange={onChange}
                name="body"
                fontSize="10pt"
                borderRadius={4}
                placeholder="Text (optional)"
                _placeholder={{ color: 'gray.500' }}
                _focus={{
                    borderColor: 'black',
                    outline: 'none',
                    border: '1px solid',
                    bg: 'white',
                }}
            />
            <Flex justify="flex-end">
                <Button
                    height="34px"
                    p="0px 30px"
                    disabled={!textInputs.title}
                    isLoading={loading}
                    onClick={handleCreatePost}
                >
                    Post
                </Button>
            </Flex>
        </Stack>
    );
};

export default TextInputs;
