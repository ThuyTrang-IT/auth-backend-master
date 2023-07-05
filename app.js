const express = require("express");
const http = require("http");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// require database connection
const dbConnect = require("./db/dbConnect");
const User = require("./db/userModel");

const auth = require("./auth");
const routes = require("./TodoRoutes/TodoRoutes");
const cors = require("cors");
app.use(cors());
// execute database connection
dbConnect();

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

// Đăng ký người dùng mới

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm kiếm người dùng với email được cung cấp
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// login
app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Tìm kiếm người dùng với email được cung cấp
  const user = await User.findOne({ email });

  if (!user) {
    console.log(`User with email ${email} not found`);
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const userpassword = user.password;

  const isPasswordValid = await bcrypt.compare(password, userpassword);

  if (!isPasswordValid) {
    console.log(`Password for user ${email} is invalid`);
    return res.status(401).json({ message: "Invalid email or password" });
  }

  console.log(`User ${email} has successfully logged in`);
  const access_token = jwt.sign(
    { userid: user._id, email: user.email },
    process.env.JWT_SECRET
  );

  return res.status(200).json({
    status: true,
    message: "Login successfully!",
    data: {
      access_token,
    },
  });
});

// Routes
const ToDoModel = require("./db/todoModel");

app.use(routes);

// free endpoint
app.get("/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});

// authentication endpoint
app.get("/auth-endpoint", auth, (request, response) => {
  response.send({ message: "You are authorized to access me" });
});

module.exports = app;
