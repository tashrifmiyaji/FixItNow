import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import prisma from "../lib/prisma";
import AppError from "../errors/AppError";
import dotEnv from "../config/dotEnv";
import { jwtHelpers } from "../utils/jwt";

import {
	UserRole,
	UserStatus,
} from "../../../generated/prisma/enums";

const auth =
	(...requiredRoles: UserRole[]) =>
	async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const authorization = req.headers.authorization;

			if (!authorization) {
				throw new AppError(
					httpStatus.UNAUTHORIZED,
					"Unauthorized access.",
				);
			}

			const token = authorization.split(" ")[1];

			if (!token) {
				throw new AppError(
					httpStatus.UNAUTHORIZED,
					"Unauthorized access.",
				);
			}

			const decoded = jwtHelpers.verifyToken(
				token,
				dotEnv.jwt_access_secret,
			);

			const user = await prisma.user.findUnique({
				where: {
					id: decoded.userId,
				},
				select: {
					id: true,
					role: true,
					status: true,
				},
			});

			if (!user) {
				throw new AppError(
					httpStatus.UNAUTHORIZED,
					"Unauthorized access.",
				);
			}

			if (user.status === UserStatus.BANNED) {
				throw new AppError(
					httpStatus.FORBIDDEN,
					"This user has been banned.",
				);
			}

			if (
				requiredRoles.length > 0 &&
				!requiredRoles.includes(user.role)
			) {
				throw new AppError(
					httpStatus.FORBIDDEN,
					"You are not authorized to access this resource.",
				);
			}

			req.user = {
				userId: user.id,
				role: user.role,
			};

			next();
		} catch (error) {
			next(error);
		}
	};

export default auth;