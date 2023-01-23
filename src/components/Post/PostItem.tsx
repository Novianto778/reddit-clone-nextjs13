import { Post } from '@atoms/postsAtom';
import {
    Alert,
    AlertIcon,
    Flex,
    Icon,
    Image,
    Skeleton,
    Spinner,
    Stack,
    Text,
} from '@chakra-ui/react';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsChat, BsDot } from 'react-icons/bs';
import { FaReddit } from 'react-icons/fa';
import {
    IoArrowDownCircleOutline,
    IoArrowDownCircleSharp,
    IoArrowRedoOutline,
    IoArrowUpCircleOutline,
    IoArrowUpCircleSharp,
    IoBookmarkOutline,
} from 'react-icons/io5';

type Props = {
    post: Post;
    userIsCreator: boolean;
    userVoteValue?: number;
    onVote: (
        e: React.MouseEvent,
        post: Post,
        voteValue: number,
        communityId: string
    ) => void;
    onDeletePost: (post: Post) => Promise<boolean>;
    onSelectPost?: (post: Post) => void;
};

const PostItem = ({
    post,
    userIsCreator,
    userVoteValue,
    onVote,
    onDeletePost,
    onSelectPost,
}: Props) => {
    const [loadingImage, setLoadingImage] = useState(true);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [error, setError] = useState('');
    const singlePostPage = !onSelectPost;
    const router = useRouter();

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            setLoadingDelete(true);
            const success = await onDeletePost(post);

            if (!success) {
                throw new Error('Error deleting post');
            }
            console.log('Post successfully deleted!');
            if (singlePostPage) {
                router.push(`/r/${post.communityId}`);
            }
        } catch (error: any) {
            console.log('handleDelete postitem error: ', error);
            setError(error.message);
        }
        setLoadingDelete(false);
    };
    return (
        <Flex
            border="1px solid"
            bg="white"
            borderColor={singlePostPage ? 'white' : 'gray.300'}
            borderRadius={singlePostPage ? '4px 4xp 0px 0px' : '4px'}
            cursor={singlePostPage ? 'unset' : 'pointer'}
            _hover={{ borderColor: singlePostPage ? 'none' : 'gray.500' }}
            onClick={() => onSelectPost && onSelectPost(post)}
        >
            <Flex
                direction="column"
                align="center"
                bg={'gray.100'}
                p={2}
                width="40px"
                borderRadius={singlePostPage ? '0' : '3px 0px 0px 3px'}
            >
                <Icon
                    as={
                        userVoteValue === 1
                            ? IoArrowUpCircleSharp
                            : IoArrowUpCircleOutline
                    }
                    color={userVoteValue === 1 ? 'brand.100' : 'gray.400'}
                    fontSize={22}
                    cursor="pointer"
                    onClick={(e) => onVote(e, post, 1, post.communityId)}
                />
                <Text fontSize="9pt" fontWeight={600}>
                    {post.voteStatus}
                </Text>
                <Icon
                    as={
                        userVoteValue === -1
                            ? IoArrowDownCircleSharp
                            : IoArrowDownCircleOutline
                    }
                    color={userVoteValue === -1 ? '#4379FF' : 'gray.400'}
                    fontSize={22}
                    cursor="pointer"
                    onClick={(e) => onVote(e, post, -1, post.communityId)}
                />
            </Flex>
            <Flex direction="column" width="100%">
                {error && (
                    <Alert status="error">
                        <AlertIcon />
                        <Text mr={2}>Error creating post</Text>
                    </Alert>
                )}
                <Stack spacing={1} p="10px 10px">
                    {post.createdAt && (
                        <Stack
                            direction="row"
                            spacing={0.6}
                            align="center"
                            fontSize="9pt"
                        >
                            {false && (
                                <>
                                    {post.communityImageURL ? (
                                        <Image
                                            borderRadius="full"
                                            boxSize="18px"
                                            src={post.communityImageURL}
                                            mr={2}
                                            alt={post.title}
                                        />
                                    ) : (
                                        <Icon
                                            as={FaReddit}
                                            fontSize={18}
                                            mr={1}
                                            color="blue.500"
                                        />
                                    )}
                                    <Link href={`r/${post.communityId}`}>
                                        <Text
                                            fontWeight={700}
                                            _hover={{
                                                textDecoration: 'underline',
                                            }}
                                            onClick={(event) =>
                                                event.stopPropagation()
                                            }
                                        >{`r/${post.communityId}`}</Text>
                                    </Link>
                                    <Icon
                                        as={BsDot}
                                        color="gray.500"
                                        fontSize={8}
                                    />
                                </>
                            )}
                            <Text color="gray.500">
                                Posted by u/{post.creatorDisplayName}{' '}
                                {moment(
                                    new Date(post.createdAt.seconds * 1000)
                                ).fromNow()}
                            </Text>
                        </Stack>
                    )}
                    <Text fontSize="12pt" fontWeight={600}>
                        {post.title}
                    </Text>
                    <Text fontSize="10pt">{post.body}</Text>
                    {post.imageURL && (
                        <Flex justify="center" align="center" p={2}>
                            {loadingImage && (
                                <Skeleton
                                    height="200px"
                                    width="100%"
                                    borderRadius={4}
                                />
                            )}
                            <Image
                                // width="80%"
                                // maxWidth="500px"
                                maxHeight="460px"
                                src={post.imageURL}
                                display={loadingImage ? 'none' : 'unset'}
                                onLoad={() => setLoadingImage(false)}
                                alt="Post Image"
                            />
                        </Flex>
                    )}
                </Stack>
                <Flex ml={1} mb={0.5} color="gray.500" fontWeight={600}>
                    <Flex
                        align="center"
                        p="8px 10px"
                        borderRadius={4}
                        _hover={{ bg: 'gray.200' }}
                        cursor="pointer"
                    >
                        <Icon as={BsChat} mr={2} />
                        <Text fontSize="9pt">{post.numberOfComments}</Text>
                    </Flex>
                    <Flex
                        align="center"
                        p="8px 10px"
                        borderRadius={4}
                        _hover={{ bg: 'gray.200' }}
                        cursor="pointer"
                    >
                        <Icon as={IoArrowRedoOutline} mr={2} />
                        <Text fontSize="9pt">Share</Text>
                    </Flex>
                    <Flex
                        align="center"
                        p="8px 10px"
                        borderRadius={4}
                        _hover={{ bg: 'gray.200' }}
                        cursor="pointer"
                    >
                        <Icon as={IoBookmarkOutline} mr={2} />
                        <Text fontSize="9pt">Save</Text>
                    </Flex>
                    {userIsCreator && (
                        <Flex
                            align="center"
                            p="8px 10px"
                            borderRadius={4}
                            _hover={{ bg: 'gray.200' }}
                            cursor="pointer"
                            onClick={handleDelete}
                        >
                            {loadingDelete ? (
                                <Spinner size="sm" />
                            ) : (
                                <>
                                    <Icon as={AiOutlineDelete} mr={2} />
                                    <Text fontSize="9pt">Delete</Text>
                                </>
                            )}
                        </Flex>
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
};

export default PostItem;
