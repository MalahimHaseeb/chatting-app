import React, { useEffect } from 'react'
import { Box, Container, Text ,Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from './Components/Authenticate/Login'
import Signup from './Components/Authenticate/Signup'
import { useSelector } from 'react-redux'

const Home = () => {
//   const fetchAgain = useSelector(state => state.fetch);
//   useEffect(() => {
  
// },[fetchAgain])
  return (
    <Container className='app' maxW='xl' centerContent>
      <Box
        d='flex'
        justifyContent='center'
        p={3}
        bg='white'
        w='100%'
        m='40px 0 15px 0'
        borderRadius='lg'
        borderWidth='1px'
        textAlign='center' // Added textAlign to center the text
      >
        <Text fontSize='2xl'>Talk-A-Tive</Text>
      </Box>
      <Box
        p={4}
        bg='white'
        w='100%'
        borderRadius='lg'
        borderWidth='1px'
      >
        <Tabs variant='soft-rounded' color={'black'}>
          <TabList mb={'1em'}>
            <Tab width={'50%'}>Login</Tab>
            <Tab width={'50%'}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {/* Login  */}
              <Login/>
            </TabPanel>
            <TabPanel>
              {/* Sign Up  */}
              <Signup/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Home
