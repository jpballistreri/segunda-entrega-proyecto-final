import { Router } from "express";
import { cartController } from "../controllers/carrito";
import { productsController } from "../controllers/productos";
import { checkAdmin } from "../middleware/admin";
import asyncHandler from "express-async-handler";

const router = Router();

router.get("/", asyncHandler(cartController.getProducts));

router.get(
  "/:id",
  cartController.checkProductExists,
  asyncHandler(cartController.getProducts)
);

router.post(
  "/:id",
  productsController.checkProductExists,
  asyncHandler(cartController.addProducts)
);

router.delete(
  "/:id",
  asyncHandler(cartController.checkProductExists),
  asyncHandler(cartController.deleteProducts)
);

export default router;
