import { z } from "zod";

const createTechnicianProfileValidationSchema = z.object({
	body: z.object({
		bio: z
			.string()
			.trim()
			.max(1000, "Bio cannot exceed 1000 characters")
			.optional(),

		experience: z
			.number()
			.int("Experience must be an integer")
			.min(0, "Experience cannot be negative"),

		location: z
			.string()
			.trim()
			.min(1, "Location is required")
			.max(200, "Location cannot exceed 200 characters"),
	}),
});

const updateTechnicianProfileValidationSchema = z.object({
	body: z.object({
		bio: z
			.string()
			.trim()
			.max(1000, "Bio cannot exceed 1000 characters")
			.optional(),

		experience: z
			.number()
			.int("Experience must be an integer")
			.min(0, "Experience cannot be negative")
			.optional(),

		location: z
			.string()
			.trim()
			.min(1, "Location is required")
			.max(200, "Location cannot exceed 200 characters")
			.optional(),
	}),
});

export const TechnicianValidation = {
	createTechnicianProfileValidationSchema,
	updateTechnicianProfileValidationSchema,
};