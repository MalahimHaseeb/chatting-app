import { Box, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const UserListItem = ({ user, handleFunction }) => {
  // const fetchAgain = useSelector(state => state.fetch);
  // useEffect(()=> {

  // },[fetchAgain])
  return (
    <>
      <Box
        onClick={handleFunction}
        cursor="pointer"
        bg="#E8E8E8"
        _hover={{
          background: "#38B2AC",
          color: "white"
        }}
        width="100%"
        display="flex"
        alignItems="center"
        color="black"
        px="3"
        py="2"
        mb="4"
        borderRadius="lg"
      >
        <Box flex="1">
          <Text>{user.name}</Text>
          <Text fontSize="xs">
            <b>Email: </b>
            {user.email}
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default UserListItem;
