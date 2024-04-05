const mongoose = require('mongoose') ;
 const connectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URL) ;
        console.log(`Mongo Db is connected on host ${connect.connection.host}`);
    } catch (error) {
         console.log(`Error in mongoo Db ${error}`) ;
    }
}
module.exports = connectDb