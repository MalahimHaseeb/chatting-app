const express = require("express")
const router = express.Router()
const User = require('../Models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {comaprePassword , hashPassword} = require('../Helper/userHelper')
const {requireLogIn , admin }  = require('../Middlewares/userMiddleware')

// Register Route
router.post('/register',async (req,res)=> {
    try {
        const {name , email , password  , friend  } = req.body ;
        if(!name || ! email || !password   || !friend ) {
            return  res.status(400).json({success:false , message : 'data is missing for creating user'})
        }
        const existingUser = await User.findOne({email: email})
        if(existingUser){
            return  res.status(400).json({success:false , message : 'user with this email is already exists'})
        }
        
        if(password.length < 8) {
            return  res.status(400).json({success:false , message : 'Password must be at least 8 characters long'})
        }else {
        const hashed = await bcrypt.hash(password , 6)  //Hashing Password
        const data = new User({
            name,
            email,
            friend ,
            // pic ,
            password : hashed 
        })
        const savedUser = await data.save();
        res.status(200).json({success:true , message : 'User created Successfully' , data : savedUser})
       }
    } catch (error) {
        res.status(400).json({success: false , message :'Error in creating User' , error: error.message})
    }
})
//login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid email or password' });
        }
        // Compare the password
        const passwordMatch = await comaprePassword(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ success: false, error: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user._id  }, process.env.JWT_SECRET, { expiresIn: '7d' }); // Set expiration time
        // Password is correct, login successful
        res.status(200).json({ success: true, message: 'Login successful', token, name: user.name , role : user.email , id : user.id});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
// Forgot Password
router.post('/forgot', async (req, res) => {
    try {
        const { email, friend, password } = req.body;
        const user = await User.findOne({ email, friend });

        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid email or friend' });
        }
        if(password.length < 8) {
            return  res.status(400).json({success:false , message : 'Password must be at least 8 characters long'})
        }
        const newPassword = await hashPassword(password);
        await User.findByIdAndUpdate(user._id, { password: newPassword });
        res.status(200).json({ success: true, message: 'Reset Password successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
//Protected route auth
router.get('/user-auth', requireLogIn, (req, res) => {
    res.status(200).send({ success: true });
})
// all users /user?search=
router.get('/', requireLogIn, async (req, res) => {
    try {
        const searchTerm = req.query.search || ''; // Get the search term from the query parameter
        const users = await User.find({
            $and: [
                { _id: { $ne: req.auth.userId } }, // Exclude the current user
                {
                    $or: [
                        { name: { $regex: searchTerm, $options: 'i' } },
                        { email: { $regex: searchTerm, $options: 'i' } }
                    ]
                }
            ]
        });
         res.status(200).send({ success: true, message : "User Found" , users });
    } catch (error) {
         res.status(500).send({ success: false, error: error.message });
    }
});

//Protected route auth admin
router.get('/admin-auth', requireLogIn, admin , (req, res) => {
    res.status(200).send({ success: true });
})

module.exports = router 