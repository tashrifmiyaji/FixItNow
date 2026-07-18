import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { ServiceService } from "./service.service";

const createService = catchAsync(async (req: Request, res: Response) => {
    const user = req.user!
	const result = await ServiceService.createService(
		user.userId,
		req.body,
	);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Service created successfully.",
		data: result,
	});
});

const getAllServices = catchAsync(async (req: Request, res: Response) => {
	const result = await ServiceService.getAllServices(req.query);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Services retrieved successfully.",
		meta: result.meta,
		data: result.data,
	});
});

const getServiceById = catchAsync(async (req: Request, res: Response) => {
	const result = await ServiceService.getServiceById(req.params.id as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Service retrieved successfully.",
		data: result,
	});
});

const updateService = catchAsync(async (req: Request, res: Response) => {
    const user = req.user!
	const result = await ServiceService.updateService(
		user.userId,
		req.params.id as string,
		req.body,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Service updated successfully.",
		data: result,
	});
});

const deleteService = catchAsync(async (req: Request, res: Response) => {
    const user = req.user!
	await ServiceService.deleteService(
		user.userId,
		req.params.id as string,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Service deleted successfully.",
		data: null,
	});
});

export const ServiceController = {
	createService,
	getAllServices,
	getServiceById,
	updateService,
	deleteService,
};