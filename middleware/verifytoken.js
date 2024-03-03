import jwt from "jsonwebtoken";
import createStatus from "http-status-codes";

export const verifyAccessToken = async function ({ cookieToken }) {
  // const Cookiestoken = req.signedCookies;
  // console.log(req.headers["authorization"]);
  // const authToken = req.headers["authorization"];

  // if (!authToken) {
  //   return res.status(createStatus.BAD_GATEWAY).json({
  //     Success: false,
  //     message: "AUTHENTICATION IS FAILED",
  //   });
  // }

  // const Bearer = authToken.split(" "); //convert into an array
  // const token = Bearer[1];
  const secret = process.env.ACCESS_TOKEN;
  jwt.verify(cookieToken, secret);
};
