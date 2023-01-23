import { Flex, Icon, MenuItem, Image } from '@chakra-ui/react';
import useDirectory from '@hooks/useDirectory';
import { IconType } from 'react-icons';

type Props = {
    displayText: string;
    link: string;
    icon: IconType;
    iconColor: string;
    imageURL?: string;
};

const MenuListItem = ({
    displayText,
    link,
    icon,
    iconColor,
    imageURL,
}: Props) => {
    const { onSelectMenuItem } = useDirectory();

    return (
        <MenuItem
            width="100%"
            fontSize="10pt"
            _hover={{ bg: 'gray.100' }}
            onClick={() =>
                onSelectMenuItem({
                    displayText,
                    link,
                    icon,
                    iconColor,
                    imageURL,
                })
            }
        >
            <Flex alignItems="center">
                {imageURL ? (
                    <Image
                        borderRadius="full"
                        boxSize="18px"
                        src={imageURL}
                        mr={2}
                        alt="Profile Picture"
                    />
                ) : (
                    <Icon fontSize={20} mr={2} as={icon} color={iconColor} />
                )}
                {displayText}
            </Flex>
        </MenuItem>
    );
};
export default MenuListItem;
