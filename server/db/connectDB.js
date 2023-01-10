const mongoose = require("mongoose");

// Set query mode
mongoose.set("strictQuery", true);

// Connection function
const connectDB = async (uri) => {
  console.log("Initiating DB connection...");

  return mongoose
    .connect(uri)
    .then(() => console.log("DB connection established successfully"))
    .catch((error) => {
      throw error;
    });
};

module.exports = connectDB;
