import { Router } from "express";

import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";

import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";

import { UserRole } from "../../../../generated/prisma/enums";

const router = Router();

router.get("/me", auth(), UserController.getMyProfile);

router.patch(
	"/me",
	auth(),
	validateRequest(UserValidation.updateProfileValidationSchema),
	UserController.updateMyProfile,
);

router.get("/", auth(UserRole.ADMIN), UserController.getAllUsers);

export default router;
