// Require the mongoose library
const mongoose = require('mongoose');

// Define the schema for your collection
const Schema = mongoose.Schema;

// Create a new schema
const MessageSchema = new Schema({
   sender : { type  : mongoose.Schema.Types.ObjectId , ref : "User" } ,
   content : { type : String , trim : true } ,
   chat : { type  : mongoose.Schema.Types.ObjectId , ref : "Chat" }
},{timestamps:true});

// Create a model using the schema
const Message = mongoose.model('Message', MessageSchema);

// Export the model
module.exports = Message;
