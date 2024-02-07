const express = require("express");
const cors = require("cors");
const app = express();
const dbConnect = require("./db");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const userRouter = require("./Routes/user.routes");
const authMiddleware = require("./Middleware/auth.middleware");
const productRouter = require("./Routes/products.routes");

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://costco-com-i4c5.vercel.app"],
    credentials: true,
  })
);
app.use(
  session({
    name: "session",
    keys: ["key1", "key2"],
    cookie: {
      secure: true,
      httpOnly: true,
      domain: "example.com",
      path: "/",
      expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      sameSite: "none", // Important for third-party cookies
    },
  })
);
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/products", productRouter);

app.get("/", authMiddleware, (req, res) => {
  try {
    res.send("Hello World!");
  } catch (error) {
    res.send(error);
  }
});

app.listen(process.env.PORT, () => {
  try {
    dbConnect();
    console.log(`Server is running on port ${process.env.PORT}`);
  } catch (error) {
    console.log(error);
  }
});
