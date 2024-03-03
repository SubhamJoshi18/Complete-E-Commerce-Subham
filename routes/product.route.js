import { Router } from "express";
import {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadProduct,
} from "../controller/product.controller.js";
import { getSingleProductReview } from "../controller/review.controller.js";
import {
  authenticatedUser,
  authorizePermission,
  isAdmin,
} from "../middleware/authenticaton.js";

const productRouter = Router();

productRouter.get("/", getAllProduct);
productRouter.get("/:id", getSingleProduct);
productRouter.post(
  "/",
  authenticatedUser,
  authorizePermission("admin"),
  isAdmin,
  createProduct
);
productRouter.patch(
  "/:id",
  authenticatedUser,
  authorizePermission("admin"),
  isAdmin,
  updateProduct
);
productRouter.delete(
  "/:id",
  authenticatedUser,
  authorizePermission("admin"),
  isAdmin,
  deleteProduct
);
productRouter.post(
  "/image",
  authenticatedUser,
  authorizePermission("admin"),
  isAdmin,
  uploadProduct
);

productRouter.get(
  "/:id/review",
  authenticatedUser,
  authorizePermission("admin", "user"),
  getSingleProductReview
);
export default productRouter;
