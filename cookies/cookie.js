import { AccessToken } from "../jwt/token.js";

export const attachedCookiesToResponse = async function ({ res, user }) {
  console.log(user);
  const { userId, name, role } = user;
  console.log(name, userId, role);
  const oneDay = 1000 * 60 * 60 * 24;
  const accessToken = await AccessToken(userId, name, role);
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};
