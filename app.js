const express = require("express");
const http = require('http');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();
// require database connection
const dbConnect = require("./db/dbConnect");
const User = require("./db/userModel");
const todoModel = require("./db/todoModel")
const auth = require("./auth");
const routes = require("./TodoRoutes/TodoRoutes")


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




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
// Đăng ký người dùng mới

app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm kiếm người dùng với email được cung cấp
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Tìm kiếm người dùng với email được cung cấp
  const user = await User.findOne({ email });

  if (!user) {
    console.log(`User with email ${email} not found`);
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const userpassword = user.password;

  const isPasswordValid = await bcrypt.compare(password, userpassword);

  if (!isPasswordValid) {
    console.log(`Password for user ${email} is invalid`);
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  console.log(`User ${email} has successfully logged in`);
  // ...
});


// Routes
const ToDoModel = require("./db/todoModel");


/* // Xử lý các yêu cầu POST để lưu trữ một mục công việc mới
app.post('/todo', async (req, res) => {
  const { text } = req.body;
  console.log(text);
  // Kiểm tra xem giá trị của thuộc tính "text" có tồn tại trong yêu cầu POST hay không
  if (!text) {
    return res.status(400).json({ message: "Thiếu thông tin về mục công việc" });
  }
  try {
    const newToDo = new ToDoModel({ text });
    const result = await newToDo.save();
    res.status(201).json(result); // Trả về mã trạng thái 201 và đối tượng mới được lưu trữ trong cơ sở dữ liệu
  } catch (err) {
    res.status(400).json({ message: err.message }); // Trả về mã trạng thái 400 và thông tin về lỗi nếu có lỗi xảy ra
  }
});
// Xử lý các yêu cầu GET để lấy danh sách các mục công việc
app.get('/todo', async (req, res) => {
  try {
    const todos = await ToDoModel.find();
    res.json(todos); // Trả về danh sách các mục công việc dưới dạng đối tượng JSON
  } catch (err) {
    res.status(500).json({ message: err.message }); // Trả về mã trạng thái 500 và thông tin về lỗi nếu có lỗi xảy ra
  }
});
app.post('/todo/save', async (req, res) => {
  const { todos } = req.body;
  try {
    const result = await ToDoModel.insertMany(todos);
    res.status(201).json(result); // Trả về mã trạng thái 201 và danh sách các mục công việc mới được lưu trữ trong cơ sở dữ liệu
  } catch (err) {
    res.status(400).json({ message: err.message }); // Trả về mã trạng thái 400 và thông tin về lỗi nếu có lỗi xảy ra
  }
});

app.put('/todo/update', async (req, res) => {
  const { todos } = req.body;
  try {
    const result = await ToDoModel.updateMany(
      { _id: { $in: todos.map(todo => todo._id) } },
      { $set: todos }
    );
    res.json(result); // Trả về thông tin về số lượng các mục công việc đã được cập nhật trong cơ sở dữ liệu
  } catch (err) {
    res.status(400).json({ message: err.message }); // Trả về mã trạng thái 400 và thông tin về lỗi nếu có lỗi xảy ra
  }
});

app.delete('/todo/{{id}}', async (req, res) => {
  const { _id } = req.body;

  console.log('id ---> ', _id);

  todoModel
      .findByIdAndDelete(_id)
      .then(() => res.set(201).send("Deleted Successfully..."))
      .catch((err) => console.log(err));

});

 */


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