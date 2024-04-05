// Require the mongoose library
const mongoose = require('mongoose');

// Define the schema for your collection
const Schema = mongoose.Schema;

// Create a new schema
const UserSchema = new Schema({
   name : { type : String , required  : true } ,
   email : { type : String , required  : true , unique: true} ,
   friend : { type : String , required  : true } ,
   password : { type : String , required  : true , minlength : 8 } ,
   role : { type : Number , default : 0 } ,
//    pic : { type : String , required  : true  ,default : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} ,
},{timestamps:true});

// Create a model using the schema
const User = mongoose.model('User', UserSchema);
// Export the model
module.exports = User;
