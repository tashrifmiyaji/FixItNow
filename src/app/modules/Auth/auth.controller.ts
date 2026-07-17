import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import dotEnv from "../../config/dotEnv";

import { AuthService } from "./auth.service";

const registerUser = catchAsync(async (req: Request, res: Response) => {
	const result = await AuthService.registerUser(req.body);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "User registered successfully.",
		data: result,
	});
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
	const result = await AuthService.loginUser(req.body);

	res.cookie("refreshToken", result.refreshToken, {
		httpOnly: true,
		secure: dotEnv.node_env === "production",
		sameSite: "lax",
	});

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User logged in successfully.",
		data: {
			accessToken: result.accessToken,
		},
	});
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
	const token = req.cookies.refreshToken;

	const result = await AuthService.refreshToken(token);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Access token generated successfully.",
		data: result,
	});
});

const getMe = catchAsync(async (req: Request, res: Response) => {
	const result = await AuthService.getMe(req.user!.userId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User profile retrieved successfully.",
		data: result,
	});
});

export const AuthController = {
	registerUser,
	loginUser,
	refreshToken,
	getMe,
};