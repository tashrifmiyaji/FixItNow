import { z } from "zod";

import { UserStatus } from "../../../../generated/prisma/enums.js";

const updateUserStatusValidationSchema = z.object({
	body: z.object({
		status: z.enum(UserStatus),
	}),
});

export const AdminValidation = {
	updateUserStatusValidationSchema,
};