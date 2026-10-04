const mongoose = require("mongoose");


async function dbConnection() {
  const dbUrl = process.env.MONGODB_URL;

    await mongoose.connect(dbUrl).then(()=>{
      console.log("Database connected hello");
    })
    return;
}

module.exports = dbConnection;