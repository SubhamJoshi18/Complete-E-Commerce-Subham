import joi from "joi";

export const SignUpValdation = joi.object({
  name: joi.string().min(3).max(140).required(),
  email: joi.string().min(5).max(120).email().required(),
  password: joi.string().min(8).required(),
});

export const LoginValidation = joi.object({
  email: joi.string().min(5).max(120).email().required(),
  password: joi.string().min(8).required(),
});
