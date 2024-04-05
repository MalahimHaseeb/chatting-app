// import { CloseIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useSelector } from 'react-redux';

const UserBadgeItem = ({ user, handleFunction }) => {
  const fetchAgain = useSelector(state => state.fetch);
  useEffect(()=> {

  },[fetchAgain])
  return (
    <Box
      paddingX="2"
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      bg="purple.500" // Set background color using bg prop
      color="white" // Set text color
      fontSize={12}
      cursor="pointer"
      onClick={handleFunction}
      display="inline-flex" // Ensure that the close icon appears on the same line
      alignItems="center" // Align items vertically
    >
      {user.name}
      <IoMdClose marginLeft="3px" /> {/* Adjust margin-left to add space between text and close icon */}
    </Box>
  );
};

export default UserBadgeItem;
