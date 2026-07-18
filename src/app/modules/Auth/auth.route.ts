import { Router } from "express";

import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

import validateRequest from "../../middlewares/validateRequest.js";
import auth from "../../middlewares/auth.js";

const router = Router();

router.post(
	"/register",
	validateRequest(AuthValidation.registerValidationSchema),
	AuthController.registerUser,
);

router.post(
	"/login",
	validateRequest(AuthValidation.loginValidationSchema),
	AuthController.loginUser,
);

router.post(
	"/refresh-token",
	AuthController.refreshToken,
);

router.get(
	"/me",
	auth(),
	AuthController.getMe,
);

export default router;