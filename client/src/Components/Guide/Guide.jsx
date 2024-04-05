import React from 'react';
import { Flex, IconButton, Text, Box, Heading, Stack } from '@chakra-ui/react';
import { IoIosArrowBack } from 'react-icons/io';
import { Link } from 'react-router-dom';

const Guide = () => {
    return (
        <>
            <Flex
                alignItems="center"
                justifyContent="space-between"
                paddingX={2}
                bg={"#E6E6E6"}
            >
                <Link to={'/'}>
                    <IconButton
                        icon={<IoIosArrowBack />}
                        aria-label="Back"
                        variant="ghost"
                        size="md"
                    />
                </Link>
                <Text
                    fontSize={{ base: "28px", md: "30px" }}
                    paddingBottom={3}
                    textAlign="center"
                >
                    Guide Page
                </Text>
                <div style={{ width: '24px' }} />
            </Flex>
            <Box p={4} maxW="800px" mx="auto">
                <Heading as="h1" textAlign="center" mb={6}>Talk-A-Tive Features</Heading>
                <Stack spacing={6}>
                    <Text>
                        - Users can send single one-to-one messages with user authorization.
                    </Text>
                    <Text>
                        - Users can create groups, add users, remove users, and leave groups with admin authorization.
                    </Text>
                    <Text>
                        - Socket.io integration for real-time messaging.
                    </Text>
                    <Text>
                        - Typing indicators to show when a user is typing.
                    </Text>
                    <Text>
                        - Receive notifications for new messages.
                    </Text>
                    <Text>
                        - Responsive Behaviour.
                    </Text>
                    <Text>
                        - Encrypted passwords and routes.
                    </Text>
                    <Text>
                        - Shortcut: Press Enter to send a message.
                    </Text>
                </Stack>
            </Box>
        </>
    );
};

export default Guide;
