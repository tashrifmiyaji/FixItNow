import httpStatus from "http-status";

import prisma from "../../lib/prisma";
import stripe from "../../lib/stripe";
import dotEnv from "../../config/dotEnv";
import AppError from "../../errors/AppError";

import {
	BookingStatus,
	PaymentProvider,
	PaymentStatus,
} from "../../../../generated/prisma/enums";

import { IGetPaymentsQuery } from "./payment.interface";

const createPayment = async (
	userId: string,
	bookingId: string,
) => {
	const booking = await prisma.booking.findUnique({
		where: {
			id: bookingId,
		},
		include: {
			service: true,
			payment: true,
		},
	});

	if (!booking) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"Booking not found.",
		);
	}

	if (booking.customerId !== userId) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"You are not authorized to pay for this booking.",
		);
	}

	if (booking.status !== BookingStatus.ACCEPTED) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Only accepted bookings can be paid.",
		);
	}

	if (
		booking.payment &&
		booking.payment.status === PaymentStatus.COMPLETED
	) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Payment has already been completed.",
		);
	}

	const payment =
		booking.payment ??
		(await prisma.payment.create({
			data: {
				bookingId: booking.id,
				amount: booking.service.price,
				provider: PaymentProvider.STRIPE,
			},
		}));

	const session = await stripe.checkout.sessions.create({
		mode: "payment",

		success_url: `${dotEnv.frontend_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

		cancel_url: `${dotEnv.frontend_url}/payment/cancel`,

		customer_email: undefined,

		metadata: {
			paymentId: payment.id,
			bookingId: booking.id,
		},

		line_items: [
			{
				quantity: 1,

				price_data: {
					currency: "bdt",

					product_data: {
						name: booking.service.title,
						description:
							booking.service.description ?? undefined,
					},

					unit_amount: Math.round(
						Number(booking.service.price) * 100,
					),
				},
			},
		],
	});

	return {
		checkoutUrl: session.url,
		sessionId: session.id,
	};
};

const getMyPayments = async (
	userId: string,
	query: IGetPaymentsQuery,
) => {
	const page = Number(query.page) || 1;
	const limit = Number(query.limit) || 10;
	const skip = (page - 1) * limit;

	const where = {
		booking: {
			customerId: userId,
		},

		...(query.status && {
			status: query.status,
		}),

		...(query.provider && {
			provider: query.provider,
		}),
	};

	const [payments, total] = await Promise.all([
		prisma.payment.findMany({
			where,
			skip,
			take: limit,
			include: {
				booking: {
					include: {
						service: true,
					},
				},
			},
			orderBy: {
				[query.sortBy || "createdAt"]:
					query.sortOrder || "desc",
			},
		}),

		prisma.payment.count({
			where,
		}),
	]);

	return {
		meta: {
			page,
			limit,
			total,
			totalPage: Math.ceil(total / limit),
		},
		data: payments,
	};
};

const getPaymentById = async (
	userId: string,
	id: string,
) => {
	const payment = await prisma.payment.findFirst({
		where: {
			id,
			booking: {
				customerId: userId,
			},
		},
		include: {
			booking: {
				include: {
					service: true,
				},
			},
		},
	});

	if (!payment) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"Payment not found.",
		);
	}

	return payment;
};

const confirmPayment = async (
	userId: string,
	sessionId: string,
) => {
	const session = await stripe.checkout.sessions.retrieve(sessionId, {
		expand: ["payment_intent"],
	});

	if (!session || session.payment_status !== "paid") {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Payment session is not completed.",
		);
	}

	const paymentId = session.metadata?.paymentId;
	const bookingId = session.metadata?.bookingId;

	if (!paymentId || !bookingId) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Payment metadata is missing.",
		);
	}

	const payment = await prisma.payment.findUnique({
		where: {
			id: paymentId,
		},
		include: {
			booking: true,
		},
	});

	if (!payment) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"Payment not found.",
		);
	}

	if (payment.booking.customerId !== userId) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"You are not authorized to confirm this payment.",
		);
	}

	if (payment.status === PaymentStatus.COMPLETED) {
		return payment;
	}

	const paymentIntentId =
		typeof session.payment_intent === "string"
			? session.payment_intent
			: session.payment_intent?.id;

	const updatedPayment = await prisma.$transaction(async (tx) => {
		const updated = await tx.payment.update({
			where: {
				id: paymentId,
			},
			data: {
				status: PaymentStatus.COMPLETED,
				transactionId: paymentIntentId ?? session.id,
				paidAt: new Date(),
			},
		});

		await tx.booking.update({
			where: {
				id: bookingId,
			},
			data: {
				status: BookingStatus.PAID,
			},
		});

		return updated;
	});

	return updatedPayment;
};

export const PaymentService = {
	createPayment,
	confirmPayment,
	getMyPayments,
	getPaymentById,
};