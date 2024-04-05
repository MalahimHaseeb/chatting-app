import React, { useState } from 'react'
import { VStack, Box, StackDivider, FormControl, FormLabel, Input, InputRightElement, Button, InputGroup } from '@chakra-ui/react'
import toast from 'react-hot-toast';
import { createLogin } from '../../Reducers/userDetail';
import { loginUser } from '../../Reducers/checkLogin';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const togglePasswordVisibility = () => {
        setShow(!show);
    };
    const dispatch = useDispatch()
    const navigate = useNavigate()

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
            const response = await dispatch(createLogin(formData));
            if (response.payload && response.payload.success) {
                toast.success(response.payload.message);
                setFormData({});
                dispatch(loginUser({ user: response.payload.name, token: response.payload.token , role : response.payload.role , id : response.payload.id }));
                localStorage.setItem('auth',JSON.stringify({name :response.payload.name , token : response.payload.token , role : response.payload.role , id : response.payload.id}))
                navigate('/')
            } else {
                setError(response.payload.error)
                //toast.error(response.payload.message, { autoClose: 1500 });
                toast.error(response.payload.error);
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
                <FormControl id='email' isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                        name='email'
                        placeholder='Enter Your Email'
                        value={formData.email}
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
                
                <Button
                    colorScheme='blue'
                    width={"100%"}
                    style={{marginTop  :15 }}
                    onClick={handleSubmit}
                >
                    Login
                </Button>
            </VStack>
        </>
    )
}

export default Login;
