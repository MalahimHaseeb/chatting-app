import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    FormControl,
    Input,
    Box,
  } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import checkLogin from '../../Reducers/checkLogin'
import toast from 'react-hot-toast'
import axios from 'axios'
import UserListItem from '../UserListItem/UserListItem'
import UserBadgeItem from './UserBadgeItem'
import { setChat } from '../../Reducers/chatReducer'
import { useNavigate } from 'react-router-dom'
import { setFetchAgain } from '../../Reducers/fetchAgain'
import { toggleFetchAgain } from '../../Reducers/errorHandling'

const GroupChatModel = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    // const toast = useToast();
    const user = useSelector(state => state.log)
    const chat = useSelector(state => state.chat.chat);
    const searching = !Array.isArray(searchResult)
    const fetchAgain = useSelector(state => state.fetch);
    
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
          toast({
            title: "User already added",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          return;
        }
        
        setSelectedUsers([...selectedUsers, userToAdd]);
      };
    
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
    
      const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
      };
     // handle Submit
      const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
          toast.error("Please fill all fields");
          return;
        }
    
        try {
          const config = {
            headers: {
              Authorization: user?.token,
            },
          };
          const { data } = await axios.post(
            `${import.meta.env.VITE_MOCK_API}/chat/group`,
            {
              name: groupChatName,
              users: JSON.stringify(selectedUsers.map((u) => u._id)),
            },
            config
          );
          const resultsArray = data.fullGroupChat; // Extracting the results array
          dispatch(setFetchAgain(true))
          onClose();
          toast.success("New Group Created");
          dispatch(toggleFetchAgain())
        } catch (error) {
            toast.error("Fail to create group");
        }
      };
  return (
    <>
    <span onClick={onOpen}>{children}</span>

    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          fontSize="25px"
          fontFamily="Work sans"
          display="flex"
          justifyContent="center"
        >
          Create Group Chat
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody d="flex" flexDir="column" alignItems="center">
          <FormControl>
            <Input
              placeholder="Chat Name"
              mb={3}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <Input
              placeholder="Add Users eg: John, Piyush, Jane"
              mb={1}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </FormControl>
          <Box w="100%" d="flex" flexWrap="wrap">
            {selectedUsers.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleDelete(u)}
              />
            ))}
          </Box>
          {loading ? (
            // <ChatLoading />
            <div>Loading...</div>
          ) : (
            Array.isArray(searchResult) && searchResult?.slice(0, 4)
              .map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleSubmit} colorScheme="blue">
            Create Chat
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
    
  )
}

export default GroupChatModel