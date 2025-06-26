import express, { Router } from "express";
import { createDiscountCodes, createProduct, deleteDiscountCodes, deleteProduct, deleteProductImage, getAllProducts, getCategories, getDiscountCodes, getShopProduct, getStripeAccount, restoreProduct, uploadProductImage } from "../controllers/product.controller";
import isAuthenticated from "@packages/middleware/isAuthenticated";
import { isSeller } from "@packages/middleware/authorizeRole";

const router: Router = express.Router();

router.get("/get-categories", getCategories);

router.post("/create-discount-code", isAuthenticated , createDiscountCodes);
router.get("/get-discount-codes", isAuthenticated , getDiscountCodes);
router.delete("/delete-discount-code/:id", isAuthenticated , deleteDiscountCodes);

router.post("/upload-product-image", isAuthenticated , uploadProductImage);
router.delete("/delete-product-image", isAuthenticated , deleteProductImage);

router.post("/create-product", isAuthenticated , createProduct);
router.get("/get-shop-products", isAuthenticated , getShopProduct);

router.delete("/delete-product/:productId", isAuthenticated, deleteProduct);
router.put("/restore-product/:productId", isAuthenticated, restoreProduct);

router.get("/get-stripe-account", isAuthenticated, isSeller, getStripeAccount);

router.get("/get-all-products", getAllProducts);

export default router;