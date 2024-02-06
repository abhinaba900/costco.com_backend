const express = require("express");
const userRouter = express.Router();
const {User} = require("../Models/user.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
const nodemailer = require("nodemailer");
const uuid = require("uuid");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "subhamsana700@gmail.com",
    pass: "dvpt birt vcxv uruc",
  },
});

// Dummy database
let users = {};

// Registration route
userRouter.post("/register-email", (req, res) => {
  const { email } = req.body;
  
  const userId = uuid.v4();
  const verificationToken = Math.floor(100000 + Math.random() * 900000); // Generate unique verification token

  // Store user with verification token and not verified status
  users[userId] = { email, verificationToken, verified: false };

  // Email verification link
  const verificationLink = `${req.url}/user/verify-email?token=${verificationToken}&userId=${userId}`;

  const mailOptions = {
    from: "subhamsana700@gmail.com",
    to: email,
    subject: "Verify your email",
    text: `Please click on the following link to verify your email: go to official website. your varification token is:-"${verificationToken}" and your user id is:-"${userId}" and your varification link is "${verificationLink}"`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error sending verification email");
    } else {
      console.log("Verification email sent: " + info.response);
      res
        .status(200)
        .send("Registration successful, please verify your email.");
    }
  });
});

// Verification route
userRouter.post("/verify-email", (req, res) => {
  const { token, userId } = req.body;

  const user = users[userId];

  if (user && user.verificationToken === token) {
    user.verified = true; // Mark the user as verified
    res.send("Email successfully verified.");
  } else {
    res.status(400).send("Invalid or expired verification link.");
  }
});
userRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Validation for name
  if (!name) {
    return res.status(422).json({ message: "Name is required" });
  }

  // Email verification
  if (!email) {
    return res.status(422).json({ message: "Email is required" });
  } else if (!validator.isEmail(email)) {
    return res.status(422).json({ message: "Invalid email format" });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    // Consider using 409 Conflict when a resource conflict occurs, such as an existing email
    return res
      .status(409)
      .json({ message: "User with this email already exists" });
  }

  // Strong password validation
  if (!password) {
    return res.status(422).json({ message: "Password is required" });
  } else if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    return res.status(422).json({
      message:
        "Password must be stronger. It should contain at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a symbol.",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    // 201 Created is appropriate for successful resource creation
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    // 500 Internal Server Error for unexpected server-side issues
    res.status(500).json({ message: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    // 400 Bad Request is more appropriate for missing input
    return res.status(400).json({ message: "Email is required" });
  }
  if (!password) {
    // 400 Bad Request is more appropriate for missing input
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    const findEmail = await User.findOne({ email });
    if (!findEmail) {
      // 404 Not Found is appropriate if the user does not exist
      return res.status(404).json({ message: "User not found" });
    }

    const comparePassword = await bcrypt.compare(password, findEmail.password);
    console.log(comparePassword);
    if (!comparePassword) {
      // 401 Unauthorized is more appropriate for wrong credentials
      return res.status(401).json({ message: "Password is incorrect" });
    }

    const authToken = jwt.sign(
      { userId: findEmail._id },
      process.env.AUTH_key, // Ensure your environment variables are consistently named
      { expiresIn: "24h" }
    );

    const refreshToken = jwt.sign(
      { userId: findEmail._id },
      process.env.REFRESH_key, // Ensure your environment variables are consistently named
      { expiresIn: "7d" }
    );

    res.cookie("authToken", authToken, {
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    });

    // 200 OK or 202 Accepted is more appropriate for a successful operation
    res
      .status(200)
      .json({ message: "Login successfully", authToken, refreshToken });
  } catch (error) {
    // 500 Internal Server Error is appropriate for server errors
    res.status(500).json({ message: error.message });
  }
});

userRouter.patch("/forgot/password", async (req, res) => {
  const { email, password } = req.body;

  // Email verification
  if (!email) {
    // 400 Bad Request for missing email
    return res.status(400).json({ message: "Email is required" });
  } else if (!validator.isEmail(email)) {
    // 400 Bad Request for invalid email format
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Strong password validation
  if (!password) {
    // 400 Bad Request for missing password
    return res.status(400).json({ message: "Password is required" });
  } else if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    // 422 Unprocessable Entity for weak password, though 400 could also be argued for consistency
    return res.status(422).json({
      message:
        "Password must be stronger. It should contain at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a symbol.",
    });
  }

  try {
    const findEmail = await User.findOne({ email });
    if (!findEmail) {
      // 404 Not Found if the user does not exist
      return res.status(404).json({ message: "User not found" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.findOneAndUpdate({ email }, { password: hashedPassword });
      // 200 OK for successful password update
      res.status(200).json({ message: "Password updated successfully" });
    }
  } catch (error) {
    // 500 Internal Server Error for server-side issues
    res.status(500).json({ message: error.message });
  }
});

userRouter.get("/logout", (req, res) => {
  try {
    res.clearCookie("authToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = userRouter;
