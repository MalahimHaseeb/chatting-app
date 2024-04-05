import React, { useState } from 'react'
import { VStack, Box, StackDivider, FormControl, FormLabel, Input, InputRightElement, Button, InputGroup } from '@chakra-ui/react'
import toast from 'react-hot-toast';
import { createUser } from '../../Reducers/userDetail';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        friend: '',
    });
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const togglePasswordVisibility = () => {
        setShow(!show);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await dispatch(createUser(formData));
          console.log(response);
          if (response.payload && response.payload.success) {
            toast.success(response.payload.message);    
              setFormData({});
              window.location.reload();
          } else {
              setError(response.payload.message)
              //toast.error(response.payload.message, { autoClose: 1500 });
              toast.error(response.payload.message);
          }
          
      } catch (error) {
          toast.error('Failed to create user. Please try again.', { autoClose: 2000 });
          console.error('Error creating user:', error);
      }
    }

    return (
        <>
            <VStack
                divider={<StackDivider borderColor='gray.200' />}
                spacing={5}
                mb={4}
                align='stretch'
            >
                <FormControl id='name' isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                        name='name'
                        placeholder='Enter Your Name'
                        value={formData.name}
                        onChange={handleChange}
                    />
                </FormControl>
                <FormControl id='email' isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                        name='email'
                        placeholder='Enter Your Email'
                        value={formData.email}
                        onChange={handleChange}
                    />
                </FormControl>
                <FormControl id='friend' isRequired>
                    <FormLabel>Friend</FormLabel>
                    <Input
                        name='friend'
                        placeholder='Enter Your Friend Name'
                        value={formData.friend}
                        onChange={handleChange}
                    />
                </FormControl>
                <FormControl id='password' isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                        <Input
                            name='password'
                            type={show ? 'text' : 'password'}
                            placeholder='Enter Your Password'
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <InputRightElement width="4.5rem">
                            <Button h="1.75rem" size='sm' onClick={togglePasswordVisibility}>
                                {show ? 'Hide' : 'Show'}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>
                {/* <FormControl id='pic'>
                    <FormLabel>Upload your Profile Pic</FormLabel>
                    <Input
                        type='file'
                        p={1.5}
                        accept='image/*'
                        onChange={(e) => PostDetails(e.target.files[0])}
                    />
                </FormControl> */}
                <Button
                    colorScheme='blue'
                    width={"100%"}
                    style={{marginTop  :15 }}
                    onClick={handleSubmit}
                >
                    SignUp
                </Button>
            </VStack>
        </>
    )
}

export default Signup;
