import { Router } from "express";

import handleStripeWebhook from "../modules/Payment/payment.webhook";

const router = Router();

router.post(
	"/stripe",
	handleStripeWebhook,
);

export default router;