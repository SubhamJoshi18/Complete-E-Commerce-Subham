import { SignUpValdation, LoginValidation } from "../validator/validate.js";
import { attachedCookiesToResponse } from "../cookies/cookie.js";
import userModel from "../models/user.js";
import createStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { AccessToken } from "../jwt/token.js";

export const registerController = async (req, res, next) => {
  const { error } = SignUpValdation.validateAsync(req.body);
  if (error) {
    return res.status(createStatus.BAD_GATEWAY).json({
      Success: false,
      Error: "Validation Failed",
    });
  }

  const { name, email, password, role } = req.body;
  const uniqueEmail = await userModel.aggregate([{ $match: { email: email } }]);
  if (uniqueEmail === "true") {
    return res.status(createStatus.BAD_GATEWAY).json({
      Success: false,
      Error: "Email Already Exists",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(password, salt);
  //Save to database now

  const firstAdminCheck = (await userModel.countDocuments({})) === 0;
  const Assignrole = firstAdminCheck /*=== "true"*/ ? "admin" : "user";
  const lowerCases = email.toLowerCase();
  const newUser = new userModel({
    name: name,
    email: lowerCases,
    password: hashPass,
    role: Assignrole,
  });

  if (newUser !== undefined || null) {
    const Created = await newUser.save();
    console.log(Created);
    const tokenUser = {
      userId: Created.name,
      name: Created._id,
      role: Created.role,
    };
    await attachedCookiesToResponse({ res, user: tokenUser });
    return res.status(createStatus.OK).json({
      Success: true,
      message: "A new User Is Created",
      UserData: {
        newUser,
      },
    });
  } else {
    return res.status(createStatus.INTERNAL_SERVER_ERROR).json({
      Success: false,
      message: "INTERNAL SERVER ERROR",
      data: null,
    });
  }
};

export const LoginController = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(createStatus.BAD_GATEWAY).json({
      Success: false,
      message: "Email/Password Field are Required",
    });
  }
  const checkEmail = await userModel.aggregate([{ $match: { email: email } }]);
  if (!checkEmail) {
    return res.status(createStatus.NOT_ACCEPTABLE).json({
      Success: false,
      message: "Email does not match",
    });
  }
  const FindEmail = await userModel.findOne({ email: email });
  const checkPassword = await bcrypt.compare(password, FindEmail.password);
  console.log(FindEmail);
  console.log(checkPassword);
  const tokenUser = {
    userId: FindEmail._id,
    name: FindEmail.name,
    role: FindEmail.role,
  };
  await attachedCookiesToResponse({ res, user: tokenUser });
  return res.status(createStatus.OK).json({
    Success: true,
    message: `${FindEmail.name} Has Been SuccessFully Logged In`,
    Data: {
      FindEmail,
    },
  });
};

export const LogoutController = async (req, res, next) => {
  console.log("hello world");
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  return res.status(createStatus.ACCEPTED).json({
    Success: true,
    message: "User Has Been SuccessFully Logged In",
  });
};

//NOTE
/*
const oneDay = 1000 * 60 * 60 * 24
res.cookie x x
ACCESS THE COOKIE

*/
