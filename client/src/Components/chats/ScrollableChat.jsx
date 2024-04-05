import React, { useEffect, useRef, useState } from 'react'
import {  isUser } from '../../config/ChatLogic'
import { useSelector } from 'react-redux'
import {  Tooltip } from '@chakra-ui/react'

const ScrollableChat = ({ messages }) => {
    const user = useSelector(state => state.log)
    const fetchAgain = useSelector(state => state.fetch);

    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const chatEndRef = useRef(null);
    useEffect(() => {
        scrollToBottom();
        const mediaQuery = window.matchMedia('(max-width: 328px)'); // Example breakpoint for small screens
        const handleScreenChange = (e) => {
            setIsSmallScreen(e.matches);
        };
        mediaQuery.addListener(handleScreenChange);
        handleScreenChange(mediaQuery);

        return () => {
            mediaQuery.removeListener(handleScreenChange);
        };
        
    }, [messages]);
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    return (
        <>
            <div style={{marginBottom : "14px"}}>
                {messages && messages.map((m, i) => (
                    <Tooltip
                        key={m._id}
                        label={m.sender.name}
                        placement='bottom-start'
                        hasArrow
                    >

                        {(isUser( messages, i, user.id) ?
                        <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                            
                            <span 
                            style={
                                {backgroundColor : '#BEE3F8' , borderRadius : "20px" , padding : '5px 15px' , width: isSmallScreen ? "auto" : "auto" , right : "5px" , alignItems : "flex-end" , marginBottom: "3px"} 
                             }
                             >
                                {/* {console.log(isSameSender)} */}
                                {m.content}
                            </span> 
                            </div> : (
                                <div style={{ display: "flex" }}>
                                    <span
                                     style={
                                         {backgroundColor : '#B9F5D0' , borderRadius : "20px" , padding : '5px 8px' ,width: isSmallScreen ? "auto" : "auto" ,marginBottom: "3px"}
        
                                     }
                                    >
                                        <b>{m.sender.name}:</b>
                                        {/* {console.log(isSameSender)} */}
                                        {m.content}
                                    </span>
                                </div>
                            )
                        )}
                    </Tooltip>
                ))}
                <div ref={chatEndRef} />
            </div>
        </>
    )
}

export default ScrollableChat
