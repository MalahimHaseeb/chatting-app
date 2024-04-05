// Require the mongoose library
const mongoose = require('mongoose');
// Define the schema for your collection
const Schema = mongoose.Schema;
// Create a new schema
const ChatSchema = new Schema({
   chatName : { type : String , trim : true } ,
   isGroupChat : { type : Boolean , default : false } ,
   users : [{
    type : mongoose.Schema.Types.ObjectId ,
    ref : "User"
   }], 
   latestMessage : {
    type : mongoose.Schema.Types.ObjectId ,
    ref  : "Message"
   } ,
   groupAdmin : {
    type : mongoose.Schema.Types.ObjectId ,
    ref : "User"
   }
},{timestamps:true});
// Create a model using the schema
const Chat = mongoose.model('Chat', ChatSchema);
// Export the model
module.exports = Chat;