import bcrypt from "bcryptjs";
import httpStatus from "http-status";

import prisma from "../../lib/prisma";
import dotEnv from "../../config/dotEnv";
import AppError from "../../errors/AppError";
import { jwtHelpers } from "../../utils/jwt";

import { UserStatus } from "../../../../generated/prisma/enums";

import { ILoginUser, IRegisterUser } from "./auth.interface";
import { IJwtPayload } from "../../interfaces/jwt.interface";

const registerUser = async (payload: IRegisterUser) => {
	const isUserExists = await prisma.user.findUnique({
		where: {
			email: payload.email,
		},
	});

	if (isUserExists) {
		throw new AppError(
			httpStatus.CONFLICT,
			"User already exists with this email.",
		);
	}

	const hashedPassword = await bcrypt.hash(
		payload.password,
		dotEnv.bcrypt_salt_round,
	);

	const user = await prisma.user.create({
		data: {
			name: payload.name,
			email: payload.email,
			password: hashedPassword,
			phone: payload.phone,
			role: payload.role,
		},
		select: {
			id: true,
			name: true,
			email: true,
			phone: true,
			role: true,
			status: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	return user;
};

const loginUser = async (payload: ILoginUser) => {
	const user = await prisma.user.findUnique({
		where: {
			email: payload.email,
		},
		select: {
			id: true,
			password: true,
			role: true,
			status: true,
		},
	});

	if (!user) {
		throw new AppError(
			httpStatus.UNAUTHORIZED,
			"Invalid email or password.",
		);
	}

	if (user.status === UserStatus.BANNED) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"This user has been banned.",
		);
	}

	const isPasswordMatched = await bcrypt.compare(
		payload.password,
		user.password,
	);

	if (!isPasswordMatched) {
		throw new AppError(
			httpStatus.UNAUTHORIZED,
			"Invalid email or password.",
		);
	}

	const jwtPayload: Pick<IJwtPayload, "userId" | "role"> = {
		userId: user.id,
		role: user.role,
	};

	const accessToken = jwtHelpers.createToken(
		jwtPayload,
		dotEnv.jwt_access_secret,
		dotEnv.jwt_access_expires_in,
	);

	const refreshToken = jwtHelpers.createToken(
		jwtPayload,
		dotEnv.jwt_refresh_secret,
		dotEnv.jwt_refresh_expires_in,
	);

	return {
		accessToken,
		refreshToken,
	};
};

const refreshToken = async (token: string) => {
	if (!token) {
		throw new AppError(
			httpStatus.UNAUTHORIZED,
			"Unauthorized access.",
		);
	}

	let decodedToken: IJwtPayload;

	try {
		decodedToken = jwtHelpers.verifyToken(
			token,
			dotEnv.jwt_refresh_secret,
		);
	} catch {
		throw new AppError(
			httpStatus.UNAUTHORIZED,
			"Invalid or expired refresh token.",
		);
	}

	const user = await prisma.user.findUnique({
		where: {
			id: decodedToken.userId,
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

	const accessToken = jwtHelpers.createToken(
		{
			userId: user.id,
			role: user.role,
		},
		dotEnv.jwt_access_secret,
		dotEnv.jwt_access_expires_in,
	);

	return {
		accessToken,
	};
};

const getMe = async (userId: string) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		select: {
			id: true,
			name: true,
			email: true,
			phone: true,
			role: true,
			status: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	if (!user) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"User not found.",
		);
	}

	return user;
};

export const AuthService = {
	registerUser,
	loginUser,
	refreshToken,
	getMe,
};