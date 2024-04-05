import React from 'react';
import { Box, Image, Flex, Text, Stack, IconButton } from '@chakra-ui/react';
import { IoIosArrowBack } from 'react-icons/io';
import { Link } from 'react-router-dom';

const Developer = () => {
    return (
        <>
            <Flex
                alignItems="center"
                justifyContent="space-between" // Align items to the start and end of the flex container
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
                    textAlign="center" // Center the text horizontally
                >
                    Malahim
                </Text>
                <div style={{ width: '24px' }} /> {/* Adjust spacing to center the text */}
            </Flex>
            <Flex align="center" justify="center" height="100vh">
                <Box
                    width={{ base: '90%', sm: '80%', md: '70%', lg: '50%' }}
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    p="4"
                >
                    <Flex align="center" justify="center">
                        <Image
                            src="./developer.jpeg"
                            alt="Developer"
                            borderRadius="full"
                            boxSize={{ base: '100px', sm: '150px', md: '200px', lg: '250px' }}
                        />
                    </Flex>
                    <Stack spacing="3" mt="4">
                        <Text fontSize="xl" fontWeight="semibold" textAlign="center">M. Malahim Haseeb</Text>
                        <Stack spacing="1" alignItems={'center'}>
                            {/* <Text><b>Role:</b> MERN Stack Developer</Text> */}
                            <Text><b>Fun Fact:</b> I am an anime lover</Text>
                            <Text><b>Insta:</b> <Link href="https://www.instagram.com/malahimhaseeb/" isExternal>MyInstagram</Link></Text>
                            <Text><b>Study:</b> BSCS</Text>
                            <Text><b>Location:</b> Lahore</Text>
                        </Stack>
                    </Stack>
                </Box>
            </Flex>
        </>
    );
};

export default Developer;
