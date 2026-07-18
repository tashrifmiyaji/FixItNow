import { Router } from "express";

import auth from "../../middlewares/auth.js";
import validateRequest from "../../middlewares/validateRequest.js";

import { PaymentController } from "./payment.controller";
import { PaymentValidation } from "./payment.validation";

import { UserRole } from "../../../../generated/prisma/enums.js";

const router = Router();

router.post(
	"/create",
	auth(UserRole.CUSTOMER),
	validateRequest(PaymentValidation.createPaymentValidationSchema),
	PaymentController.createPayment,
);

router.post(
	"/confirm",
	auth(UserRole.CUSTOMER),
	validateRequest(PaymentValidation.confirmPaymentValidationSchema),
	PaymentController.confirmPayment,
);

router.get("/", auth(UserRole.CUSTOMER), PaymentController.getMyPayments);

router.get("/:id", auth(UserRole.CUSTOMER), PaymentController.getPaymentById);

export default router;
