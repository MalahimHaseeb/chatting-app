const bcrypt = require('bcrypt')
 const comaprePassword = async (password , hashPassword)=>  {
    try {
        return bcrypt.compare( password , hashPassword);
    } catch (error) {
        console.log('Error in comparing password')
    }
   }
    const hashFriend = async (friend ) => {
    try {
        if (!friend) {
            throw new Error('Password is required');
        }
        const hashfriend =  await bcrypt.hash(friend, 6);
        return hashfriend;
    } catch (error) {
        console.log('Error in hashing password:', error);
        throw error; // Rethrow the error to propagate it to the caller
    }
  };
   const hashPassword = async (password ) => {
    try {
        if (!password) {
            throw new Error('Password is required');
        }
        const hashPassword =  await bcrypt.hash(password, 6);
        return hashPassword;
    } catch (error) {
        console.log('Error in hashing password:', error);
        throw error; // Rethrow the error to propagate it to the caller
    }
  };
module.exports = {comaprePassword , hashFriend , hashPassword}
