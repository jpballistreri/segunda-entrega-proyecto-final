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

router.put("/", (req, res) => {
  res.json("PUT A CARRITO");
});

router.delete("/", (req, res) => {
  res.json("DELETE A CARRITO");
});

export default router;
