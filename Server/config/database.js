const mongoose = require("mongoose");

const databaseConnection = async (callback) => {
  try {
    if (process.env.DATABASE_URL) {
      const client = await mongoose.connect(process.env.DATABASE_URL);
      if (client) {
        console.log("Database Connection Successfully Made!");
        callback();
      } else {
        console.log("Database URL is not Provided");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = databaseConnection;
