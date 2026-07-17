import { z } from "zod";

const createReviewValidationSchema = z.object({
	body: z.object({
		bookingId: z.string().uuid("Invalid booking id"),

		rating: z
			.number()
			.int("Rating must be an integer")
			.min(1, "Rating must be at least 1")
			.max(5, "Rating cannot be greater than 5"),

		comment: z
			.string()
			.trim()
			.max(1000, "Comment cannot exceed 1000 characters")
			.optional(),
	}),
});

const updateReviewValidationSchema = z.object({
	body: z.object({
		rating: z
			.number()
			.int("Rating must be an integer")
			.min(1, "Rating must be at least 1")
			.max(5, "Rating cannot be greater than 5")
			.optional(),

		comment: z
			.string()
			.trim()
			.max(1000, "Comment cannot exceed 1000 characters")
			.optional(),
	}),
});

export const ReviewValidation = {
	createReviewValidationSchema,
	updateReviewValidationSchema,
};