import express, { Router } from "express";
import { createShop, getUser, loginUser, refreshToken, resetUserPassword, sellerRegistration, userForgotPassword, userRegistration, verifyForgotPassword, verifySeller, verifyUser } from "../controller/auth.controller";
import isAuthenticated from "@packages/middleware/isAuthenticated";

const router: Router = express.Router();

router.post("/user-registration", userRegistration);
router.post("/verify-user", verifyUser);
router.post("/login-user", loginUser);
router.post("/refresh-token-user", refreshToken);
router.get("/logged-in-user", isAuthenticated, getUser);
router.post("/forgot-password-user", userForgotPassword);
router.post("/verify-forgot-password-user", verifyForgotPassword);
router.post("/reset-password-user", resetUserPassword);

router.post('/seller-registration', sellerRegistration);
router.post("/verify-seller", verifySeller);
router.post("/create-shop", createShop);

export default router;