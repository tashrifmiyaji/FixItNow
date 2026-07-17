import { Router } from "express";

import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";

import { ReviewController } from "./review.controller";
import { ReviewValidation } from "./review.validation";

import { UserRole } from "../../../../generated/prisma/enums";

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