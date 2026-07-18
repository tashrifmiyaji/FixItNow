import { RequestHandler } from "express";
import httpStatus from "http-status";

import AppError from "../errors/AppError";
import { UserRole } from "../../../generated/prisma/enums.js";

const authorize = (...roles: UserRole[]): RequestHandler => {
	return (req, res, next) => {
		const user = req.user!;
    
		if (!roles.includes(user.role)) {
			throw new AppError(
				httpStatus.FORBIDDEN,
				"You are not authorized to access this resource!",
			);
		}

		next();
	};
};

export default authorize;
