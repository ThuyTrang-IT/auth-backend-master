
const mongoose = require("mongoose");


// user schema
const UserSchema = new mongoose.Schema({
  // Định nghĩa schema cho tài khoản người dùng

  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

});

// export UserSchema
module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);
