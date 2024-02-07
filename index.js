const express = require("express");
const cors = require("cors");
const app = express();
const dbConnect = require("./db");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const session = require("express-session"); // Added express-session import
const userRouter = require("./Routes/user.routes");
const productRouter = require("./Routes/products.routes");
const authMiddleware = require("./Middleware/auth.middleware");

// Middleware to parse JSON bodies
app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:3000", "https://costco-com-i4c5.vercel.app"], // Ensure these are your front-end domains
    credentials: true, // Allows cookies to be sent and received when making requests from the front-end
  })
);

// Session configuration
app.use(
  session({
    name: "session",
    secret: process.env.SESSION_SECRET || "defaultSessionSecret", // Use a secure secret from environment variables
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Secure cookies in production
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      domain: process.env.COOKIE_DOMAIN || "localhost", // Set your domain
      path: "/",
      expires: new Date(Date.now() + 60 * 60 * 1000), // Set cookie expiration
      sameSite: "none", // Necessary for cross-site requests
    },
  })
);

// Use cookie parser middleware
app.use(cookieParser());

// Routes
app.use("/user", userRouter);
app.use("/products", productRouter);

// Root route with authentication middleware
app.get("/", authMiddleware, (req, res) => {
  try {
    res.send("Hello World!");
  } catch (error) {
    res.send(error);
  }
});

// Start server and connect to the database
app.listen(process.env.PORT, () => {
  try {
    dbConnect();
    console.log(`Server is running on port ${process.env.PORT}`);
  } catch (error) {
    console.log(error);
  }
});
