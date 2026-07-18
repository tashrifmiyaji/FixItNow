import { Router } from "express";

import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";

import { PaymentController } from "./payment.controller";
import { PaymentValidation } from "./payment.validation";

import { UserRole } from "../../../../generated/prisma/enums";

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
