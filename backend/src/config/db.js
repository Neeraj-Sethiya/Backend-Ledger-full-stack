const mongoose = require("mongoose");

const connectToDB = () => {
    mongoose.connect(process.env.MONGO_URI)
    .then(()=> {
        console.log("server connected to DB");
        
    })
    .catch( err => {
        console.log("failed to connect DB");
        process.exit(1);
    })
}

module.exports = connectToDB;