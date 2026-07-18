import { z } from "zod";

import { BookingStatus } from "../../../../generated/prisma/enums.js";

const createBookingValidationSchema = z.object({
	body: z.object({
		serviceId: z
			.string()
			.uuid("Invalid service id"),

		bookingDate: z.coerce.date({
			message: "Invalid booking date",
		}),
	}),
});

const updateBookingStatusValidationSchema = z.object({
	body: z.object({
		status: z.enum(BookingStatus),
	}),
});

export const BookingValidation = {
	createBookingValidationSchema,
	updateBookingStatusValidationSchema,
};