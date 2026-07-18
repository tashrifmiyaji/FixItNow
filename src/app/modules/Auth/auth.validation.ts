import { z } from "zod";
import { UserRole } from "../../../../generated/prisma/enums.js";

const registerValidationSchema = z.object({
	body: z.object({
		name: z
			.string()
			.trim()
			.min(1, "Name is required")
			.max(100, "Name cannot exceed 100 characters"),

		email: z.email("Invalid email address").trim().toLowerCase(),

		password: z
			.string()
			.min(6, "Password must be at least 6 characters")
			.max(100, "Password cannot exceed 100 characters"),

		phone: z
			.string()
			.trim()
			.regex(/^(\+8801|01)[3-9]\d{8}$/, "Invalid phone number")
			.optional(),

		role: z.enum(UserRole),
	}),
});

const loginValidationSchema = z.object({
	body: z.object({
		email: z.email("Invalid email address").trim().toLowerCase(),

		password: z.string().min(1, "Password is required"),
	}),
});

export const AuthValidation = {
	registerValidationSchema,
	loginValidationSchema,
};
