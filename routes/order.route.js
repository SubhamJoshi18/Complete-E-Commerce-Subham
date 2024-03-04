import { Router } from "express";
import {
  getallOrder,
  getSingleOrder,
  getCurrentUserOrder,
  createOrder,
  updateOrder,
} from "../controller/order.controller.js";

import {
  authenticatedUser,
  authorizePermission,
  isAdmin,
  isUser,
} from "../middleware/authenticaton.js";
const Orderrouter = Router();

Orderrouter.post("/", authenticatedUser, createOrder);
Orderrouter.get(
  "/:id",
  authenticatedUser,
  authorizePermission("admin", "user"),
  isUser,
  getSingleOrder
);
Orderrouter.patch(
  "/:id",
  authenticatedUser,
  authorizePermission("admin", "user"),
  updateOrder
);
Orderrouter.get(
  "/:id/show",
  authenticatedUser,
  authorizePermission("user"),
  getCurrentUserOrder
);
Orderrouter.get(
  "/",
  authenticatedUser,
  authorizePermission("user"),
  isUser,
  getallOrder
);

export default Orderrouter;
