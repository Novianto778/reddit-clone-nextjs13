'use client';
import { Post } from '@atoms/postsAtom';
import { Alert, AlertIcon, Flex, Text } from '@chakra-ui/react';
import { firestore, storage } from '@firebase/clientApp';
import { User } from 'firebase/auth';
import {
    addDoc,
    collection,
    serverTimestamp,
    Timestamp,
    updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BiPoll } from 'react-icons/bi';
import { BsLink45Deg, BsMic } from 'react-icons/bs';
import { IoDocumentText, IoImageOutline } from 'react-icons/io5';
import ImageUpload from './PostForm/ImageUpload';
import TabItem from './TabItem';
import TextInputs from './PostForm/TextInputs';
import useSelectFile from '@hooks/useSelectFile';

type Props = {
    user: User;
    communityId: string;
};

export type TextInputType = {
    title: string;
    body: string;
};

const formTabs = [
    {
        title: 'Post',
        icon: IoDocumentText,
    },
    {
        title: 'Images & Video',
        icon: IoImageOutline,
    },
    {
        title: 'Link',
        icon: BsLink45Deg,
    },
    {
        title: 'Poll',
        icon: BiPoll,
    },
    {
        title: 'Talk',
        icon: BsMic,
    },
] as const;

export type SelectedTabType = typeof formTabs[number]['title'];

export type TabItemType = typeof formTabs[number];

const NewPostForm = ({ user, communityId }: Props) => {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState<SelectedTabType>(
        formTabs[0].title
    );
    const [textInputs, setTextInputs] = useState<TextInputType>({
        title: '',
        body: '',
    });

    const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const handleCreatePost = async () => {
        const { title, body } = textInputs;
        // create new post object => type Post
        const newPost: Post = {
            communityId,
            // communityImageURL: communityImageURL || '',
            creatorId: user.uid,
            creatorDisplayName: user.email!.split('@')[0],
            title,
            body,
            numberOfComments: 0,
            voteStatus: 0,
            createdAt: serverTimestamp() as Timestamp,
        };
        setLoading(true);
        try {
            // store the post in db
            const postDocRef = await addDoc(
                collection(firestore, 'posts'),
                newPost
            );
            // check for selectedFile
            // // store in storage => getDownloadURL return imageURL
            // // update post object with imageURL

            if (selectedFile) {
                const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
                await uploadString(imageRef, selectedFile, 'data_url');
                const downloadURL = await getDownloadURL(imageRef);

                await updateDoc(postDocRef, {
                    imageURL: downloadURL,
                });
            }
        } catch (error: any) {
            console.log('handleCreatePost error: ', error);
            setError(true);
        }
        setLoading(false);
        // redirect the user back to the community page
        router.back();
    };

    const onTextChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setTextInputs((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <Flex direction="column" bg="white" borderRadius={4} mt={2}>
            <Flex width="100%">
                {formTabs.map((item) => (
                    <TabItem
                        key={item.title}
                        item={item}
                        selected={item.title === selectedTab}
                        setSelectedTab={setSelectedTab}
                    />
                ))}
            </Flex>
            <Flex p={4}>
                {selectedTab === 'Post' && (
                    <TextInputs
                        textInputs={textInputs}
                        handleCreatePost={handleCreatePost}
                        onChange={onTextChange}
                        loading={loading}
                    />
                )}
                {selectedTab === 'Images & Video' && (
                    <ImageUpload
                        selectedFile={selectedFile}
                        onSelectImage={onSelectFile}
                        setSelectedFile={setSelectedFile}
                        setSelectedTab={setSelectedTab}
                    />
                )}
            </Flex>
            {error && (
                <Alert status="error">
                    <AlertIcon />
                    <Text mr={2}>Error creating post</Text>
                </Alert>
            )}
        </Flex>
    );
};

export default NewPostForm;
