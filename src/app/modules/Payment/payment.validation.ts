import { z } from "zod";

const createPaymentValidationSchema = z.object({
	body: z.object({
		bookingId: z.string().uuid("Invalid booking id"),
	}),
});

const confirmPaymentValidationSchema = z.object({
	body: z.object({
		sessionId: z
			.string()
			.min(1, "Session id is required"),
	}),
});

export const PaymentValidation = {
	createPaymentValidationSchema,
	confirmPaymentValidationSchema,
};