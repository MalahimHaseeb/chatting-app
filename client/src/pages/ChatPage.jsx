import React, { useEffect, useState } from 'react'
import axios from "axios"
import { Box, Container, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import SideDrawer from '../Components/chats/SideDrawer'
import MyCharts from '../Components/chats/MyCharts'
import ChatBox from '../Components/chats/ChatBox'
const ChatPage = () => {
  const [chats, setChats] = useState([])
  
  const user = useSelector(state => state.log)
  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_MOCK_API}/chats`);
      const { data } = response.data
      console.log(data)
      setChats(data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='app' style={{ width: "100%" }}>
      {user && !user?.token == '' && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        height="91.5vh"
        padding="10px"
      >
        {user && user.token !== '' && <MyCharts />}
        {user && user.token !== '' && <ChatBox />}
      </Box>


    </div>
  )
}

export default ChatPage