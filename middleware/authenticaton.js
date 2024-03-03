//check the token is valid or not
import jwt from "jsonwebtoken";
import { verifyAccessToken } from "./verifytoken.js";

// async function givePayload(token) {
//   return new Promise((resolve, reject) => {
//     jwt.verify(token, process.env.ACCESS_TOKEN, (err, payload) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(payload);
//       }
//     });
//   });
// }

export const authenticatedUser = async (req, res, next) => {
  const { accessToken } = req.signedCookies;
  console.log(accessToken);

  try {
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN);

    console.log(payload);
    req.user = payload;
    console.log(req.user);

    next();
  } catch (err) {
    console.error(err);
  }
};

export const authorizePermission = (...roles) => {
  return (req, res, next) => {
    console.log(req.user);
    if (!roles.includes(req.user.userRole)) {
      console.log("You are not unauthorized");
      return res.status(403).json({
        Success: false,
        message: "You are not Authroized",
      });
    }
    next();
  };
};

export const isAdmin = (req, res, next) => {
  if (req.user.userRole === "admin") {
    console.log("You are Admin");
    next();
  } else {
    return res.status(403).json({
      Success: false,
      message: "You are not An Admin",
    });
  }
};
export const isUser = (req, res, next) => {
  if (req.user.userRole === "user") {
    console.log("You are a User");
    next();
  } else {
    return res.status(403).json({
      Success: false,
      message: "You are not a User",
    });
  }
};
