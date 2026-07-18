import { Request, Response } from "express";
import httpStatus from "http-status";

import stripe from "../../lib/stripe";
import prisma from "../../lib/prisma";
import dotEnv from "../../config/dotEnv";

import {
	BookingStatus,
	PaymentStatus,
} from "../../../../generated/prisma/enums";


const handleStripeWebhook = async (
	req: Request,
	res: Response,
) => {
	const signature = req.headers["stripe-signature"];

	if (!signature) {
		return res.status(httpStatus.BAD_REQUEST).json({
			success: false,
			message: "Stripe signature missing.",
		});
	}

	let event;

	try {
		event = stripe.webhooks.constructEvent(
			req.body,
			signature,
			dotEnv.stripe_webhook_secret,
		);
	} catch (error) {
		return res.status(httpStatus.BAD_REQUEST).json({
			success: false,
			message: "Invalid webhook signature.",
		});
	}

	if (event.type === "checkout.session.completed") {
		const session = event.data.object;

		const paymentId = session.metadata?.paymentId;
		const bookingId = session.metadata?.bookingId;

		if (paymentId && bookingId) {
			await prisma.$transaction([
				prisma.payment.update({
					where: {
						id: paymentId,
					},
					data: {
						status: PaymentStatus.COMPLETED,
						transactionId: session.id,
						paidAt: new Date(),
					},
				}),

				prisma.booking.update({
					where: {
						id: bookingId,
					},
					data: {
						status: BookingStatus.PAID,
					},
				}),
			]);
		}
	}

	res.status(httpStatus.OK).json({
		success: true,
		message: "Webhook received.",
	});
};

export default handleStripeWebhook;