import { Router } from "express";
import {
  getAllUser,
  getSingleUser,
  getCurrentUser,
  updateUserPassword,
  updateEmailPassword,
} from "../controller/user.controller.js";
import { isUser } from "../middleware/authenticaton.js";
import { authorizePermission } from "../middleware/authenticaton.js";
import { authenticatedUser } from "../middleware/authenticaton.js";
const userRouter = Router();

userRouter
  .route("/")
  .get(
    authenticatedUser,
    authorizePermission("admin", "user"),
    isUser,
    getAllUser
  );
userRouter
  .route("/:id")
  .get(
    authenticatedUser,
    authorizePermission("admin", "user"),
    isUser,
    getSingleUser
  );
userRouter.get(
  "/sh/:show",
  authenticatedUser,
  authorizePermission("admin", "user"),
  isUser,
  getCurrentUser
);

userRouter.patch(
  "/up/:update",
  authenticatedUser,
  authorizePermission("admin", "user"),
  isUser,
  updateUserPassword
);

userRouter.patch(
  "/ch/:name",
  authenticatedUser,
  authorizePermission("admin", "user"),
  isUser,
  updateEmailPassword
);
export default userRouter;
