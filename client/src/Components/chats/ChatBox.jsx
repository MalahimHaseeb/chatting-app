import { Box } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import SingleChat from './SingleChat'

const ChatBox = () => {
  const chat = useSelector(state => state.chat)
  const selectedChat = useSelector(state => state.selectedChat.selectedChat)
  // useEffect(()=>{
  //   console.log(selectedChat)
  // })
  return (
    <Box
      display={{
        base: selectedChat.length != 0 ? "flex" : "none",
        md: "flex"
      }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      {/* Content */}
      <SingleChat />
    </Box>

  )
}

export default ChatBox