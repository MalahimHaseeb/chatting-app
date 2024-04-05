const express = require("express");
const { requireLogIn } = require("../Middlewares/userMiddleware");
const Message = require("../Models/Message");
const User = require("../Models/User");
const Chat = require("../Models/Chat");
const router = express.Router()

router.all('/', (req, res, next) => {
    res.status(200).json({ success: true, message: 'Return from Message Router' })
    next()
});

router.post('/post' , requireLogIn , async(req , res) => {
    const {chatID , content } = req.body 
    if(!content || !chatID) {
        return  res.status(400).json({ success: false, message: 'Fields are missing' })
    }
    const newMessage = {
        sender : req.auth.userId ,
        content : content ,
        chat : chatID
    }
    try {
        const message = await Message.create(newMessage);
    
        // Populate sender and chat information
        await message.populate("sender", "name");
        await message.populate("chat");
        await User.populate(message, {
            path: "chat.users",
            select: 'name email'
        });
    
        await Chat.findByIdAndUpdate(req.body.chatID, {
            latestMessage: message,
        });
    
        res.status(200).send( message );
    } catch (error) {
        return res.status(400).json({ success: false, message: 'Error in sending Message', error: error.message });
    }
    
    
})
router.get('/:chatId' , requireLogIn , async(req , res) => {
    try {
        const message = await Message.find({ chat : req.params.chatId}).populate(
            "sender" ,
            "name email"
        ).populate(
            "chat" 
        )
        // Populate sender and chat information
        res.status(200).send( message );
    } catch (error) {
        return res.status(400).json({ success: false, message: 'Error in geting Message', error: error.message });
    }
    
})
module.exports = router;