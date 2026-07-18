import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";

import { TechnicianService } from "./technician.service";

const createProfile = catchAsync(async (req: Request, res: Response) => {
	const user = req.user!;
	const result = await TechnicianService.createProfile(user.userId, req.body);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Technician profile created successfully.",
		data: result,
	});
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
	const user = req.user!;
	const result = await TechnicianService.updateProfile(user.userId, req.body);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Technician profile updated successfully.",
		data: result,
	});
});

const getAllTechnicians = catchAsync(async (req: Request, res: Response) => {
	const result = await TechnicianService.getAllTechnicians(req.query);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Technicians retrieved successfully.",
		meta: result.meta,
		data: result.data,
	});
});

const getTechnicianById = catchAsync(async (req: Request, res: Response) => {
	const result = await TechnicianService.getTechnicianById(
		req.params.id as string,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Technician retrieved successfully.",
		data: result,
	});
});

export const TechnicianController = {
	createProfile,
	updateProfile,
	getAllTechnicians,
	getTechnicianById,
};
