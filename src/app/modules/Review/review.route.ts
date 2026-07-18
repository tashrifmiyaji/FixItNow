import { Router } from "express";

import auth from "../../middlewares/auth.js";
import validateRequest from "../../middlewares/validateRequest.js";

import { ReviewController } from "./review.controller";
import { ReviewValidation } from "./review.validation";

import { UserRole } from "../../../../generated/prisma/enums.js";

const router = Router();

router.get(
	"/",
	ReviewController.getAllReviews,
);

router.post(
	"/",
	auth(UserRole.CUSTOMER),
	validateRequest(
		ReviewValidation.createReviewValidationSchema,
	),
	ReviewController.createReview,
);

router.patch(
	"/:id",
	auth(UserRole.CUSTOMER),
	validateRequest(
		ReviewValidation.updateReviewValidationSchema,
	),
	ReviewController.updateReview,
);

export default router;