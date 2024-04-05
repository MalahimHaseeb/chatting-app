// import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, FormControl, IconButton, Input, Spinner, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedChat } from '../../Reducers/selectedChats';
import { getSender } from '../../config/ChatLogic';
import UpdateGroupChatModel from './UpdateGroupChatModel';
import axios from 'axios';
import toast from 'react-hot-toast';
import './styles.css'
import ScrollableChat from './ScrollableChat';
import { toggleFetchAgain } from '../../Reducers/errorHandling';

import io from 'socket.io-client'
import { setNotification } from '../../Reducers/notificationsReducer';
import { IoIosArrowBack } from 'react-icons/io';

const ENDPOINT = `${import.meta.env.VITE_MOCK_API}`
var socket , selectedChatCompair ;

const SingleChat = () => {
  const fetchAgain = useSelector(state => state.fetch);
  const user = useSelector(state => state.log)
  const chat = useSelector(state => state.chat);
  const selectedChat = useSelector(state => state.selectedChat.selectedChat)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [error, setError] = useState(false)
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)


  //Global Reducers
  const notification = useSelector(state => state.notification.notification)

  const sendMessage = async(event) => {
   if(event.key === "Enter" && newMessage){
    // socket.emit("stop typing" , selectedChat._id)
     try { 
       const config = {
        headers: {
          "Content-Type" : "application/json" ,
          Authorization: user?.token,
        },
      };
      setNewMessage('')
      const { data } = await axios.post(`${import.meta.env.VITE_MOCK_API}/message/post`, {content: newMessage , chatID : selectedChat._id}, config);
      socket.emit("new message", data);
      setMessages(prevMessages => [ ...prevMessages , data]);
      // setSocketConnected(true)
      setError(!error) 
     } catch (error) {
      toast.error("Error in sending message")
     }
   }
  }
  //Recieving messages
  const fetchMessages = async() => {
        if (!selectedChat) return ;
        try {
          const config = {
            headers: {
              Authorization: user?.token,
            },
          };
          const { data } = await axios.get(`${import.meta.env.VITE_MOCK_API}/message/${selectedChat._id}`, config);
          setMessages(data)
          setLoading(false)
          socket.emit('join chat' , selectedChat._id)
        } catch (error) {
          console.log("Error in recieving messages")
        }
  } 
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing" , ()=> setIsTyping(true))
    socket.on("stop typing" , ()=> setIsTyping(false))
    // eslint-disable-next-line

  },[]);

  useEffect(() => {    
    fetchMessages()

    selectedChatCompair = selectedChat ;
    // eslint-disable-next-line
  }, [selectedChat , error , messages ])
  useEffect(()=> {
    socket.on("message recieved",(newMessageRecieved) => {
       if(!selectedChat || selectedChat._id !== newMessageRecieved._id) {
        if (Array.isArray(notification) && !notification.includes(newMessageRecieved)) {
          // console.log(newMessageRecieved)
          dispatch(setNotification([  ...notification , newMessageRecieved ]));
          dispatch(toggleFetchAgain());
          console.log(notification , '---------');
        }
       } else {
          setMessages([ ...messages , newMessageRecieved]);
        //  fetchMessages()
       }
     })
   })
  //Typing Function 
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
  
    // Emit typing event only if the new message is not empty
    if (e.target.value.trim() !== '') {
      if (!typing) {
        setTyping(true);
        socket.emit("typing", selectedChat._id);
      }
      let lastTypingTime = new Date().getTime();
      var timerLength = 3000;
      setTimeout(() => {
        var timeNow = new Date().getTime();
        var timeDifference = timeNow - lastTypingTime;
  
        if (timeDifference >= timerLength && typing) {
          socket.emit("stop typing", selectedChat._id);
          setTyping(false);
        }
      }, timerLength);
    } else {
      // If the new message is empty, emit stop typing event immediately
      if (typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }
  };
  useEffect(() => {
    socket.on("typing", (userId) => {
      if (userId !== user.id) {
        setIsTyping(true); // Set typing indicator for other users
      }
    });
  
    socket.on("stop typing", (userId) => {
      if (userId !== user.id) {
        setIsTyping(false); // Remove typing indicator for other users
      }
    });
  
    return () => {
      socket.off("typing");
      socket.off("stop typing");
    };
  }, [user.id]);
    
  const dispatch = useDispatch()
  return (
    <>
    {selectedChat.length != 0 ? (
  <>
    <Text 
      fontSize={{ base: "28px", md: "30px" }}
      paddingBottom={3}
      paddingX={2}
      width="100%"
      display="flex"
      justifyContent={{ base: "space-between" }}
      alignItems="center"
    >
       <IconButton
        display={{ base: "flex", md: "none" }}
        icon={<IoIosArrowBack />}
        onClick={() => dispatch(setSelectedChat([]))}
      /> 
      {!selectedChat.isGroupChat ? (
        <>
          {getSender(user, selectedChat.users)}
        </>
      ) : (
        <>
        {selectedChat.chatName.toUpperCase()}
          <UpdateGroupChatModel fetchMessages={fetchMessages} />
        </>
               )}
     </Text>
     <Box
      display="flex"
      flexDirection="column"
      justifyContent="end"
      p={3}
      bg="#E8E8E8"
      width="100%"
      height="100%"
      borderRadius="lg"
      overflowY="hidden"
    >
       {loading ? (
        <Spinner
          size='xl'
          width={20}
          height={20}
          alignSelf="center"
          margin="auto"
        />
      ) : (
        <>
          <div className='messages'>
            {/* Messages  */}
            <ScrollableChat messages ={messages}/>
          </div>
        </>
      )}
      { isTyping ? <div>typing...</div> : (<></>)}
      <FormControl
        onKeyDown={sendMessage}
        isRequired
        mt={3}
      >
        <Input
          variant="filled"
          bg="#E0E0E0"
         placeholder='Enter a message...'
          onChange={typingHandler}
          value={newMessage}
          autoComplete="off"
        />
      </FormControl>
     </Box>
   </>
)
  : (
    <Box display="flex" alignItems="center" justifyContent="center"
      height="100%" >
      <Text
        fontSize="3xl" paddingBottom="3"
      >
        Click on a user to start conversation
      </Text>
    </Box>
  )
 }
        </>
  )
}

export default SingleChat
