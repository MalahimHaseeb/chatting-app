import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';
import { setChat } from '../../Reducers/chatReducer';
import toast from 'react-hot-toast';
import { Box, Text, Stack, Button } from '@chakra-ui/react';
// import { AddIcon } from '@chakra-ui/icons';
import { setSelectedChat } from '../../Reducers/selectedChats';
import ChatLoading from '../ChatLoading/ChatLoading';
import { getSender } from '../../config/ChatLogic';
import GroupChatModel from './GroupChatModel';
import { IoMdAdd } from 'react-icons/io';
const MyCharts = () => {
  const [loggesUser, setLoggedUser] = useState('')
  //Selectors
  const selectedChat = useSelector(state => state.selectedChat)
  const user = useSelector(state => state.log)
  const chat = useSelector(state => state.chat);
  const error = useSelector(state => state.error);
  const fetchAgain = useSelector(state => state.fetch);

  const selecting = selectedChat.selectedChat.data
  const dispatch = useDispatch()
  const done = !Array.isArray(chat)
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: user?.token,
        }
      };
      const { data } = await axios.get(`${import.meta.env.VITE_MOCK_API}/chat/userChats`, config);

      const resultsArray = data.results; // Extracting the results array
      // Logging the results array
      dispatch(setChat(resultsArray)); // Dispatching the results array to the Redux store
    } catch (error) {
      toast.error("Failed to load the chat");
    }
  };

  useEffect(() => {
    fetchChats()
    setLoggedUser(JSON.parse(localStorage.getItem("auth")))
  }, [fetchAgain , error])
 

  return (
    <>
      <Box
        display={{ base: selectedChat.selectedChat.length !== 0 ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        p={3}
        bg="white"
        w={{ base: "100vw", md: "39%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Box
          pb={3}
          px={3}
          fontSize={{ base: "22px", md: "30px" }}
          fontFamily="Work sans"
          display="flex"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text>My Chats</Text>
          <GroupChatModel>
            <Button
              // onClick={handleSubmit}
              d="flex"
              fontSize={{ base: "12px", md: "14px", lg: "17px" }}
              rightIcon={<IoMdAdd />}
            >
              New Group Chat
            </Button>
          </GroupChatModel>
        </Box>

        <Box
          d="flex"
          flexDir="column"
          p={3}
          bg="#F8F8F8"
          w="100%"
          h="77vh"
          borderRadius="lg"
          overflowY="hidden"
        >
          {chat ? (
            <Stack overflowY="scroll" >
              {done && chat.chat.map((singleChat) => (


                <Box
                  onClick={() => dispatch(dispatch(setSelectedChat(singleChat)))}
                  cursor="pointer"
                  bg={selecting === singleChat ? "#38B2AC" : "#E8E8E8"}
                  color={selecting === singleChat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={singleChat._id}
                >

                  <Text fontSize="xs">
                    <b>{singleChat.isGroupChat && 'Group Name :'} </b>
                    {!singleChat.isGroupChat ? (
                      getSender(loggesUser, singleChat.users)
                    ) : singleChat.chatName}
                  </Text>

                </Box>

              ))}
            </Stack>
          ) : (
            <ChatLoading />
          )}

        </Box>
      </Box>
    </>
  )
}

export default MyCharts