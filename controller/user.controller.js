import userModel from "../models/user.js";
import { authenticatedUser } from "../middleware/authenticaton.js";
import { AccessToken } from "../jwt/token.js";
import bcrypt from "bcryptjs";
export const getAllUser = async (req, res, next) => {
  const findUser = await userModel.aggregate([
    { $match: { role: "admin" } },
    { $group: { _id: { role: "$role" }, totalUser: { $sum: 1 } } },
  ]);
  const findUser1 = await userModel
    .findOne({ role: "admin" })
    .select("-password");
  res.json({
    Success: true,
    message: "Here are the List of the User",
    Description: [{ findUser }],
    Users: {
      findUser1,
    },
  });
};

export const getSingleUser = async (req, res, next) => {
  const newId = req.params.id;
  const findUserById = await userModel.aggregate([
    {
      $match: { _id: newId },
    },
    { $group: { _id: { role: "$role" }, ID_Found: { $sum: 1 } } },
  ]);

  const findactualUser = await userModel
    .findOne({ _id: newId })
    .select("-password");
  res.json({
    Success: true,
    message: "Here is the individual User",
    Description: {
      findUserById,
    },
    User: {
      findactualUser,
    },
  });
};

export const getCurrentUser = async (req, res, next) => {
  console.log(req.params.show);
  const userId = req.params.show;
  console.log(req.user);
  const findUserById = await userModel.aggregate([
    {
      $match: { _id: userId },
    },
    { $group: { _id: { role: "$role" }, ID_Found: { $sum: 1 } } },
  ]);
  console.log(findUserById);
  const findUser = await userModel.findOne({ _id: userId });
  if (!findUser) {
    return res.status(403).json({
      Success: false,
      message: "User not Found",
    });
  }
  res.cookie("set-header", "User", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(201).json({
    Success: true,
    message: "Here is your Profile",
    UserData: {
      userId: req.user.aud,
      userName: req.user.username,
      userRole: req.user.userRole,
    },
  });
};

export const updateUserPassword = async (req, res, next) => {
  const userId = req.params.update;
  console.log(req.user);
  console.log(userId);
  const findTheUser = await userModel.findOne({ _id: userId });
  console.log(findTheUser.password);
  const { oldpassword, newpassword, reEntered_Password } = req.body;

  if ((!oldpassword || !newpassword, !reEntered_Password)) {
    return res.status(403).json({
      Success: false,
      message: "Please Enter your Old and New Password",
    });
  }
  const checkPassword = await bcrypt.compare(oldpassword, findTheUser.password);
  if (checkPassword === false) {
    return res.status(403).json({
      Success: false,
      message: "Please Enter your Correct Old Password",
    });
  }
  if (checkPassword === true) {
    if (newpassword === reEntered_Password) {
      const changeThePassword = await userModel.updateOne(
        { _id: userId },
        { password: newpassword }
      );

      const findUser = await userModel.aggregate([
        { $project: { _id: 0, name: 1, role: 1 } },
      ]);
      return res.status(201).json({
        Success: true,
        message: "Password Has Been Changed SuccessFuly",
        Details: {
          findUser,
        },
      });
    }
  }
};

export const updateEmailPassword = async (req, res, next) => {
  const userId = req.params.name;
  console.log(req.user);
  const { Newname, email } = req.body;
  if (!name || !email) {
    return res.status(403).json({
      Success: false,
      message: "Please Enter Email and Name",
    });
  }
  const findTheUser = await userModel.findOne({ _id: userId });
  if (!findTheUser) {
    return res.status(403).json({
      Succses: false,
      message: "User Does not Exist",
    });
  }

  // const findUpdate = await userModel.updateOne(
  //   { _id: userId },
  //   {
  //     $set: {
  //       name: name,
  //       email: email,
  //     },
  //   }
  // );
  const findagainUpdate = await userModel.findOneAndUpdate(
    { _id: userId },
    {
      name: Newname,
      email: email,
    }
  );
  //create arko accesstoken updatevayera
  const { _id, name, role } = findagainUpdate;
  const accessToken = await accessToken(_id, name, role);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    signed: true,
  });
  return res.status(401).json({
    message: "Name and Email is Changed",
  });
  console.log(findagainUpdate);
  // console.log(findUpdate);
};
