// import { BellIcon, ChevronDownIcon, CloseIcon } from '@chakra-ui/icons';
import { Box, Button, Text, Menu, MenuButton, MenuList, MenuItem, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, useDisclosure, useBreakpointValue, DrawerBody, Input, Spinner } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../Reducers/checkLogin';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import ChatLoading from '../ChatLoading/ChatLoading';
import UserListItem from '../UserListItem/UserListItem';
import selectedChats, { setSelectedChat } from '../../Reducers/selectedChats';
import { setChat } from '../../Reducers/chatReducer';
import { setFetchAgain } from '../../Reducers/fetchAgain';
import { toggleFetchAgain } from '../../Reducers/errorHandling';
import { getSender } from '../../config/ChatLogic';
import { setNotification } from '../../Reducers/notificationsReducer';
import {FaAngleDown, FaBell} from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io';
// import { IoClose, IoMdClose } from 'react-icons/io'

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.log)
  const chat = useSelector(state => state.chat)
  const [loggesUser, setLoggedUser] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure();
  const drawerWidth = useBreakpointValue({ base: '80%', md: '20%' }); // Adjust width based on screen size
  

  //Global States
  const notification = useSelector(state => state.notification.notification)
  // const user = useSelector(state => state.log)

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success('Logout Successfully');
    navigate('/');
  };
  const handleSearch = async () => {
    if (!search) {
      toast.error('Please enter something into toast')
    }
    try {
      setLoading(true)

      const config = {
        headers: {
          Authorization: user?.token,
        },
      }
      const { data } = await axios.get(`${import.meta.env.VITE_MOCK_API}/user?search=${search}`, config)
      setLoading(false)

      setSearchResult(data.users)
      console.log(Array.isArray(searchResult))
    } catch (error) {
      toast.error("Failed to load the search results")
    }
  }
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("auth")))
  }, [])

  const accessChat = async (userID) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: user?.token,
        },
      };

      // Send userID in an object with the key "id"
      const requestData = { id: userID };

      const { data } = await axios.post(`${import.meta.env.VITE_MOCK_API}/chat/post`, requestData, config);
      if (chat && Array.isArray(chat) && !chat.find((c) => c._id === data.data._id)) {
        dispatch(setChat([data, ...chat]));
      }
      // dispatch(setSelectedChat([data, ...selectedChats]));
      // window.location.reload()
      console.log(data)
      dispatch(toggleFetchAgain())
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast.error("Error in getting chat");
    }
  }
  return (
    <>
      <Box
        display='flex'
        justifyContent='space-between'
        bg='white'
        width='100%'
        p='5px 10px'
        borderWidth='2px'
      >
        <Button variant='ghost' onClick={onOpen}>
          <i className="fa fa-search" aria-hidden="true"></i>
          <Text
            display={{ base: "none", md: "flex" }}
            px={4}
          >
            Search User
          </Text>
        </Button>
        <Text
          fontSize={"2xl"}
          textAlign='center'
        >
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton p='4px' mr={23} position="relative">
              <FaBell  fontSize="4xl" mr={3} />
              {notification.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    backgroundColor: 'red',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '12px',
                  }}
                >
                  {notification.length - 1}
                </div>
              )}
            </MenuButton>

            <MenuList pl={2}>
              {!notification.length && <MenuItem>No New Messages</MenuItem>}
              {[...new Map(notification.map(item => [item._id, item])).values()].map((notif) => (
                <MenuItem key={notif._id} onClick={() => {
                  dispatch(setSelectedChat(notif.chat))
                  dispatch(setNotification(notification.filter((n) => n !== notif)));
                }}>
                  {notif.chat.isGroupChat ? `New Message in ${notif.chat.chatName}` : `New Message from ${notif.sender.name}`}
                </MenuItem>
              ))}

            </MenuList>

          </Menu>
          <Menu>
            <MenuButton p='4px' as={Button} rightIcon={<FaAngleDown  />} >
              {loggesUser.name}
            </MenuButton >
            <MenuList>
             <Link to={'/guide'}><MenuItem>Guide</MenuItem></Link>
              <Link to={'/developer'}><MenuItem>Developer</MenuItem></Link>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement='left' onClose={onClose} isOpen={isOpen} width={drawerWidth}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px" display="flex" justifyContent="space-between" alignItems="center">Search Users <IoMdClose  onClick={onClose} cursor={"pointer"} /></DrawerHeader>
          <DrawerBody>
            <Box display="flex" paddingBottom="2px">
              <Input
                placeholder='search by name or email'
                marginRight="14px"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              Array.isArray(searchResult) && searchResult.length > 0 ? (
                searchResult.map(user => (
                  <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
                ))
              ) : (
                <Text>No search results found.</Text>
              )
            )}
            {loadingChat && <Spinner ml='auto' display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
