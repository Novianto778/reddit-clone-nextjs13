import { Flex, Button, Stack, Image } from '@chakra-ui/react';
import React from 'react';
import { useRef } from 'react';
import { SelectedTabType } from '../NewPostForm';

type Props = {
    selectedFile?: string;
    onSelectImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setSelectedTab: (tab: SelectedTabType) => void;
    setSelectedFile: (file: string) => void;
};

const ImageUpload = ({
    selectedFile,
    onSelectImage,
    setSelectedFile,
    setSelectedTab,
}: Props) => {
    const selectedFileRef = useRef<HTMLInputElement>(null);
    return (
        <Flex direction="column" justify="center" align="center" width="100%">
            {selectedFile ? (
                <>
                    <Image
                        src={selectedFile as string}
                        maxWidth="400px"
                        maxHeight="400px"
                        alt="post image"
                    />
                    <Stack direction="row" mt={4}>
                        <Button
                            height="28px"
                            onClick={() => setSelectedTab('Post')}
                        >
                            Back to Post
                        </Button>
                        <Button
                            variant="outline"
                            height="28px"
                            onClick={() => setSelectedFile('')}
                        >
                            Remove
                        </Button>
                    </Stack>
                </>
            ) : (
                <Flex
                    justify="center"
                    align="center"
                    p={20}
                    border="1px dashed"
                    borderColor="gray.200"
                    borderRadius={4}
                    width="100%"
                >
                    <Button
                        variant="outline"
                        height="28px"
                        onClick={() => selectedFileRef.current?.click()}
                    >
                        Upload
                    </Button>
                    <input
                        id="file-upload"
                        type="file"
                        accept="image/x-png,image/gif,image/jpeg"
                        hidden
                        ref={selectedFileRef}
                        onChange={onSelectImage}
                    />
                </Flex>
            )}
        </Flex>
    );
};

export default ImageUpload;
