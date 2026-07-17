import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { ReviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
	const user = req.user!;
	const result = await ReviewService.createReview(user.userId, req.body);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Review submitted successfully.",
		data: result,
	});
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
	const result = await ReviewService.getAllReviews(req.query);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Reviews retrieved successfully.",
		meta: result.meta,
		data: result.data,
	});
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
	const user = req.user!;
	const result = await ReviewService.updateReview(
		user.userId,
		req.params.id as string,
		req.body,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Review updated successfully.",
		data: result,
	});
});

export const ReviewController = {
	createReview,
	getAllReviews,
	updateReview,
};
