import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";

import { AdminService } from "./admin.service";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
	const result = await AdminService.getAllUsers(req.query);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Users retrieved successfully.",
		meta: result.meta,
		data: result.data,
	});
});

const updateUserStatus = catchAsync(
	async (req: Request, res: Response) => {
		const result = await AdminService.updateUserStatus(
			req.params.id as string,
			req.body,
		);

		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: "User status updated successfully.",
			data: result,
		});
	},
);

const getAllBookings = catchAsync(
	async (req: Request, res: Response) => {
		const result = await AdminService.getAllBookings(req.query);

		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: "Bookings retrieved successfully.",
			meta: result.meta,
			data: result.data,
		});
	},
);

export const AdminController = {
	getAllUsers,
	updateUserStatus,
	getAllBookings,
};