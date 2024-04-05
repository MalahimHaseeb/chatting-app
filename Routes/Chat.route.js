const express = require("express");
const { requireLogIn } = require("../Middlewares/userMiddleware");
const Chat = require("../Models/Chat");
const User = require("../Models/User");
const router = express.Router()

router.all('/', (req, res, next) => {
    res.status(200).json({ success: true, message: 'Return from chat Router' })
    next()
});
router.post('/post', requireLogIn, async (req, res) => {
    const { id } = req.body;
    if (!id) {
        console.log("User Id param not send with request")
        return res.status(400).send({ success: false, message: "User Id param not send with request" })
    }
    const chat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.auth.userId } } },
            { users: { $elemMatch: { $eq: id } } }
        ]
    }).populate("users", "-password").populate("latestMessage")

    const nechat = await User.populate(chat, {
        path: 'latestMessage.sender',
        select: "name email",
    })
    if (nechat.length > 0) {
        res.status(200).json({ success: true, message: 'SuccessFully got chats', data: nechat[0] })
    } else {
        const chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.auth.userId, id]
        }
        try {
            const createdChat = await Chat.create(chatData)
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password")
            res.status(200).json({ success: true, message: 'SuccessFully created the chat', FullChat })
        } catch (error) {
            return res.status(400).send({ success: false, message: "Error in creating the chat" })
        }
    };
})
router.get('/userChats', requireLogIn, async (req, res) => {
    try {
        const userChats = await Chat.find({ 
            $or: [
              { users: req.auth.userId }, 
              { groupAdmin: req.auth.userId }
            ]
          }).populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await Chat.populate(results, {
                    path: "latestMessage.sender",
                    select: "name email"
                })
                res.status(200).json( {results} )
            })
    } catch (error) {
        res.status(400).json({ success: true, message: 'Error in getting the Chats' })
    }
})
//Creating Group Chat
router.post('/group', requireLogIn, async (req, res) => {
    const { users, name } = req.body;
    if (!users || !name) {
        return res.status(400).json({ success: true, message: 'Please fill all the fields' })
    }
    const user = JSON.parse(users)
    if (user.length < 2) {
        return res.status(400).json({ success: true, message: 'At least 2 users required to form a group' })
    }
    try {
        const groupChat = await Chat.create({
            chatName: name,
            users: user,
            isGroupChat: true,
            groupAdmin: req.auth.userId
        })
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
        res.status(200).json({ success: true, message: 'SuccessFully creating The Group Chat', fullGroupChat })
    } catch (error) {
        return res.status(400).json({ success: true, message: 'Error in creating group chat', error: error.message })
    }
})
// Renaming the chat
router.put('/rename', requireLogIn, async (req, res) => {
    try {
        const { chatID, chatName } = req.body
        const updatedChat = await Chat.findByIdAndUpdate(
            chatID,
            { chatName },
            { new: true }
        )
        if (updatedChat) {
            const fullGroupChat = await Chat.findOne({ _id: chatID })
                .populate("users", "-password")
                .populate("groupAdmin", "-password")
            res.status(200).json({ success: true, message: 'SuccessFully renaming the group', fullGroupChat })
        } else {
            res.status(400).json({ success: false, message: 'Error in renaming the group chat' })
        }
    } catch (error) {
        return res.status(400).json({ success: true, message: 'Error in renaming group chat', error: error.message })
    }

})
// Deleting the chat
router.delete('/delete', requireLogIn, async (req, res) => {
    try {
        const { chatID } = req.body;

        // Check if the chatID is provided
        if (!chatID) {
            return res.status(400).json({ success: false, message: 'Chat ID is required' });
        }

        // Find the group chat by ID and remove it
        const deletedChat = await Chat.findByIdAndRemove(chatID);

        // Check if the group chat was deleted successfully
        if (deletedChat) {
            // Optionally, you can return additional data or a success message
            return res.status(200).json({ success: true, message: 'Group chat deleted successfully' });
        } else {
            // If the chat with the provided ID was not found
            return res.status(404).json({ success: false, message: 'Group chat not found' });
        }
    } catch (error) {
        // If an error occurs during the deletion process
        return res.status(500).json({ success: false, message: 'Error deleting group chat', error: error.message });
    }
});
// remove the member from the group
router.put('/groupRemove', requireLogIn, async (req, res) => {
    try {
        const { chatID, userID } = req.body
        const added = await Chat.findByIdAndUpdate(chatID ,{$pull : {users :userID }})
        if (added) {
            const fullGroupChat = await Chat.findOne({ _id: chatID })
                .populate("users", "-password")
                .populate("groupAdmin", "-password")
            res.status(200).send(fullGroupChat)
        } else {
            res.status(400).json({ success: false, message: 'Error in removing the member' })
        }
      } catch (error) {
        return res.status(400).json({ success: true, message: 'Error in removing the member in group chat', error: error.message })
      }
})
// remove the member from the group
router.put('/groupPersonRemove', requireLogIn, async (req, res) => {
    const { chatId } = req.body
    try {
        const added = await Chat.findByIdAndUpdate( chatId ,{$pull : {users : req.auth.userId }})
        if (added) {
            const fullGroupChat = await Chat.findOne({ _id: chatId})
                .populate("users", "-password")
                .populate("groupAdmin", "-password")
            res.status(200).json({ success: true, message: 'SuccessFully removed the member', fullGroupChat })
        } else {
            res.status(400).json({ success: false, message: 'Error in removing the member' })
        }
      } catch (error) {
        return res.status(400).json({ success: true, message: 'Error in removing the member in group chat', error: error.message })
      }
})
// add the member in the group
router.put('/groupAdd', requireLogIn, async (req, res) => {
  try {
    const { chatID, userID } = req.body
    const added = await Chat.findByIdAndUpdate(chatID ,{$push : {users :userID }})
    if (added) {
        const fullGroupChat = await Chat.findOne({ _id: chatID })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
        res.status(200).json({ success: true, message: 'SuccessFully added the member', fullGroupChat })
    } else {
        res.status(400).json({ success: false, message: 'Error in adding the member' })
    }
  } catch (error) {
    return res.status(400).json({ success: true, message: 'Error in adding the member in group chat', error: error.message })
  }
})
module.exports = router;