import jwt from "jsonwebtoken";

export const AccessToken = async function (userId, userName, userRole) {
  return new Promise((resolve, reject) => {
    const payload = {
      aud: userId,
      username: userName,
      userRole: userRole,
    };
    const secret = process.env.ACCESS_TOKEN;
    const options = {
      issuer: "Subham",
      expiresIn: "1h",
    };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};
