import { Router } from "express";

import auth from "../../middlewares/auth.js";
import validateRequest from "../../middlewares/validateRequest.js";

import { TechnicianController } from "./technician.controller";
import { TechnicianValidation } from "./technician.validation";

import { UserRole } from "../../../../generated/prisma/enums.js";

const router = Router();

router.get("/", TechnicianController.getAllTechnicians);

router.get("/:id", TechnicianController.getTechnicianById);

router.post(
	"/profile",
	auth(UserRole.TECHNICIAN),
	validateRequest(
		TechnicianValidation.createTechnicianProfileValidationSchema,
	),
	TechnicianController.createProfile,
);

router.put(
	"/profile",
	auth(UserRole.TECHNICIAN),
	validateRequest(
		TechnicianValidation.updateTechnicianProfileValidationSchema,
	),
	TechnicianController.updateProfile,
);

export default router;
