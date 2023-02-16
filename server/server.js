require("dotenv").config({ path: "./.env" });

// Express module import and server instance
const express = require("express");
const app = express();

// Use async error module
require("express-async-errors");

// Import CORS middleware
const cors = require("cors");
// Import Helmet to handle security headers
const helmet = require("helmet");
// Import Node input sanitizer
const xss = require("xss-clean");
// Import Express rate limiter
const rateLimiter = require("express-rate-limit");
// Import Mongo sanitizer
const sanitizer = require("express-mongo-sanitize");
// Import Cookie parser
const cookieParser = require("cookie-parser");

// Setup body parser and json use
app.use(express.json());

// Setup proxy
app.set("trust proxy", 1);
// Setup rate limit (100 req/15 min)
const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

// Use security middleware for all routes
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(limiter);

// Use sanitizer
app.use(sanitizer());
// Use cookie parser
app.use(cookieParser(process.env.JWT_SECRET));

// Import custom middleware
const { errorHandler, notFound } = require("./middleware");

// Import routers
const productRouter = require("./routers/products");
const productTypesRouter = require("./routers/productTypes");
const contactFormRouter = require("./routers/contactForms");
const userRouter = require("./routers/users");
const authRouter = require("./routers/authorization");

// Public resources
app.use("/public", express.static("static"));

// Setup routers
app.use("/api/v1/product_types", productTypesRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/contact", contactFormRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);

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
