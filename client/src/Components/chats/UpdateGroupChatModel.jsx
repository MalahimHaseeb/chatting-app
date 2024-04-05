import { Box, Button, FormControl, IconButton, Input, useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
// import { ViewIcon } from '@chakra-ui/icons';
import UserBadgeItem from './UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserListItem/UserListItem';
import { toggleFetchAgain } from '../../Reducers/errorHandling';
import toast from 'react-hot-toast';
import { setSelectedChat } from '../../Reducers/selectedChats';
import {MdOutlinePreview} from 'react-icons/md'

const UpdateGroupChatModel = ({fetchMessages}) => {
    const fetchAgain = useSelector(state => state.fetch);
    const selectedChat = useSelector(state => state.selectedChat.selectedChat)
    const user = useSelector(state => state.log)
    const chat = useSelector(state => state.chat)
    const [selectedUsers, setSelectedUsers] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);
    const done = !Array.isArray(selectedChat)
    const dispatch = useDispatch()

    const handleRemove = async(delUser) => {
      // setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
      if(selectedChat.groupAdmin.email !== user?.role && delUser.role !== user?.role){
        toast.error('Invalid credentials')
        return ;
      }
      try {
        setLoading(true)

        const config = {
          headers: {
            Authorization: user?.token,
          },
        };
        const { data } = await axios.put(`${import.meta.env.VITE_MOCK_API}/chat/groupRemove`, { chatID : selectedChat._id , userID : delUser._id}  ,config);
        dispatch(toggleFetchAgain())
        fetchMessages()
        setLoading(false)
        toast.success('Successfully removing the user')
        onClose()
        dispatch(setSelectedChat(data))
      } catch (error) {
        toast.error("Error in removing User")
      }
    }
 // Remove Single Person
 const handleDelete = async() => {
  try {
    setLoading(true)
    
    const config = {
      headers: {
        Authorization: user?.token,
      },
    };
    const { data } = await axios.put(`${import.meta.env.VITE_MOCK_API}/chat/groupPersonRemove`,{chatId : selectedChat._id} , config);

    
    dispatch(toggleFetchAgain())
    fetchMessages()
    setLoading(false)
    toast.success('Successfully removing the user')
    onClose()
    dispatch(setSelectedChat([]))
  } catch (error) {
    toast.error("Error in removing User")
  }
}
    // Renaming the chat
    const handleRename = async() => {
      if(!groupChatName) return ;
      try {
        setRenameLoading(true)

        const config = {
          headers: {
            Authorization: user?.token,
          },
        };
        const { data } = await axios.put(`${import.meta.env.VITE_MOCK_API}/chat/rename`, {chatID: selectedChat._id , chatName: groupChatName},config);
        dispatch(toggleFetchAgain())
        dispatch(setSelectedChat([]))
        setRenameLoading(false)
        onClose()
        toast.success('successfully changed the name')
      } catch (error) {
        toast.success('Error in changing name')
      }
      setGroupChatName("")
    }
    const handleSearch = async(query) => {
      setSearch(query);
      if (!query) {
        return;
      }
  
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: user?.token,
          },
        };
        const { data } = await axios.get(`${import.meta.env.VITE_MOCK_API}/user?search=${search}`, config);
        setLoading(false);
        setSearchResult(data.users);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Search Results",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    };

    // Add the users
    const handleAddUser = async(userToAdd) => {
      if (selectedChat.users.find((u)=> u._id === userToAdd._id)) {
        toast.error("User Already there");
        return;
      }
      
      if(selectedChat.groupAdmin.email !== user?.role) {
        toast.error("Only Admin can add users")
        return ;
      }
      try {
        setLoading(true)

        const config = {
          headers: {
            Authorization: user?.token,
          },
        };
        const { data } = await axios.put(`${import.meta.env.VITE_MOCK_API}/chat/groupAdd`, { chatID : selectedChat._id , userID : userToAdd._id}  ,config);

        dispatch(toggleFetchAgain())
        setLoading(false)
        toast.success('Successfully adding the user')
        onClose()
        dispatch(setSelectedChat([]))
      } catch (error) {
        toast.error("Error in adding User")
      }
    };
  return (
    <>
      <IconButton display={{base: "flex"}} icon={<MdOutlinePreview />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize="25px"
          display="flex"
          justifyContent="center"
          >{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* <Lorem count={2} /> */}
            <Box>
            {selectedChat.users.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleRemove(u)}
              />
             ))}
            </Box>
            <FormControl display="flex" >
              <Input 
              placeholder='Chat Name'
              mb={3}
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
              variant='solid'
              colorScheme='teal'
              ml= {1}
              isLoading={renameLoading}
              onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
            <Input
              placeholder="Add Users eg: John, Piyush, Jane"
              mb={1}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </FormControl>
          {loading ? (
            // <ChatLoading />
            <div>Loading...</div>
          ) : (
            Array.isArray(searchResult) && searchResult?.slice(0, 4)
              .map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
          )}
          </ModalBody>
        
          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={()=>        handleDelete()}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModel