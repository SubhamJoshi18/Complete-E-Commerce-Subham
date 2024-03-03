import { Router } from "express";
import {
  GetAllReviews,
  GetSingleReview,
  createReviews,
  UpdateReview,
  DeleteReview,
} from "../controller/review.controller.js";
import {
  authenticatedUser,
  authorizePermission,
} from "../middleware/authenticaton.js";
const Reviewrouter = Router();

Reviewrouter.get(
  "/",

  GetAllReviews
);
Reviewrouter.get("/:id", GetSingleReview);
Reviewrouter.post(
  "/",
  authenticatedUser,
  authorizePermission("admin", "user"),
  createReviews
);
Reviewrouter.patch(
  "/:id",
  authenticatedUser,
  authorizePermission("admin", "user"),
  UpdateReview
);
Reviewrouter.delete(
  "/:id",
  authenticatedUser,
  authorizePermission("admin", "user"),
  DeleteReview
);

export default Reviewrouter;
