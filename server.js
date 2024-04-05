const express = require("express")
const chats = require('./data/data')
const dotenv = require("dotenv")
const cors = require("cors")
const connectDb = require("./DataBase/connectDB")
const  ChatRouter  = require("./Routes/Chat.route")
const  UserRouter = require("./Routes/User.route")
const  MessageRoute = require("./Routes/Message.route")
dotenv.config()
connectDb()
const app = express()
app.use(express.json())
app.use(cors())
const port = process.env.PORT || 5050
app.get('/', (req,res) => {
    res.status(200).send({success : true , message : "hello"})
})
app.get('/chats', (req,res) => {
    try {
        res.status(200).send({success : true , message : "chats" , data:chats})
    } catch (error) {
        res.status(200).send({success : false , message : "Error in fetching" })
    }
   
})
//getting single chat
app.get('/chats/:id' , (req, res) => {
    const singleChat = chats.find((c) => c._id === req.params.id);
    res.status(200).send({success : true , message : "singleChat" , singleChat})
})
app.use('/user', UserRouter)
app.use('/chat', ChatRouter)
app.use('/message', MessageRoute)
const server = app.listen(port , () => {
    console.log(`app is running on http://localhost:${port}`)
})

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "Enter Frontend URL"
    }
});

// io.on("connection" , (socket) => {
//     socket.on('setup' , (userData) => {
//         socket.join(userData.role)
//         console.log(userData.role)
//         socket.emit('connected')
//     })
//     socket.on('join chat' , (room) => {
//        socket.join(room)
//        console.log("User joined room :" , room)
//     })

//     socket.on('newMessage' , (newMessageReceived)=> {
//         var chat = newMessageReceived.chat ;
//         if(!chat.users) return console.log("chat.users not defined")
        
//         chat.users.forEach(user => {
//             if(user._id == newMessageReceived.sender._id) return 
            
//             socket.in(user._id).emit("message recieved socket" , newMessageReceived)
//         })
//     })
    
// })

io.on("connection", (socket) => {
    // console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
    socket.join(userData.id);
    socket.emit("connected");
    });
  
    socket.on("join chat", (room) => {
      socket.join(room);
    //   console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  
    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;
    //   console.log(newMessageRecieved)
      if (!chat.users) return console.log("chat.users not defined");
  
      chat.users.forEach((user) => {
        // console.log(user)
        // console.log(newMessageRecieved.sender._id)
        if (user._id == newMessageRecieved.sender._id) return;
        //  console.log(newMessageRecieved)
        socket.in(user._id).emit("message recieved", newMessageRecieved);
      });
    });

    socket.off("setup" , ()=> {
        console.log("User Disconnected")
        socket.leave(userData._id)
    })
});  
