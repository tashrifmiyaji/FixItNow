import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";

import { UserService } from "./user.service";

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
	const result = await UserService.getMyProfile(req.user!.userId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Profile retrieved successfully.",
		data: result,
	});
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
	const result = await UserService.updateMyProfile(
		req.user!.userId,
		req.body,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Profile updated successfully.",
		data: result,
	});
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
	const result = await UserService.getAllUsers(req.query);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Users retrieved successfully.",
		meta: result.meta,
		data: result.data,
	});
});

export const UserController = {
	getMyProfile,
	updateMyProfile,
	getAllUsers,
};
