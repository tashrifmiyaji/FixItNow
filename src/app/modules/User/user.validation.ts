import { z } from "zod";

import { UserStatus } from "../../../../generated/prisma/enums";

const updateProfileValidationSchema = z.object({
	body: z.object({
		name: z
			.string()
			.trim()
			.min(1, "Name is required")
			.max(100, "Name cannot exceed 100 characters")
			.optional(),

		phone: z
			.string()
			.trim()
			.regex(
				/^(\+8801|01)[3-9]\d{8}$/,
				"Invalid phone number",
			)
			.optional(),
	}),
});

const updateUserStatusValidationSchema = z.object({
	body: z.object({
		status: z.enum(UserStatus),
	}),
});

export const UserValidation = {
	updateProfileValidationSchema,
	updateUserStatusValidationSchema,
};