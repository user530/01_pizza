require("dotenv").config({ path: "./.env" });

const express = require("express");
const app = express();

// Use async error module
require("express-async-errors");

app.use(express.json());

// Import custom middleware
const { errorHandler, notFound } = require("./middleware");

// Import routers
const productRouter = require("./routers/products");

// Setup routers
app.use("/api/v1/", productRouter);

// Setup custom middleware
app.use(notFound);
app.use(errorHandler);

// Declare and invoke start function
void (async function start() {
  const connectDB = require("./db/connectDB");
  const port = process.env.PORT || 3000;

  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log("Server is up and running at port " + port);
    });
  } catch (error) {
    console.log("Server failed to start, terminating...");
    console.error(error);
    process.exit(1);
  }
})();
