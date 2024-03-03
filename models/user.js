import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a appropriate Name"],
    unique: true,
    minlength: 3,
    maxlength: 140,
  },
  email: {
    type: String,
    required: [true, "Please Enter a Appropriate Email"],
    unique: true,
    minlength: 5,
    maxlength: 120,
  },
  password: {
    type: String,
    required: [true, "Please Enter A Password"],
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

const userModel = mongoose.model("User", userSchema);
export default userModel;
