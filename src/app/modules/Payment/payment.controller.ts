import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { PaymentService } from "./payment.service";

const createPayment = catchAsync(async (req: Request, res: Response) => {
    const user = req.user!
	const result = await PaymentService.createPayment(
		user.userId,
		req.body.bookingId,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Checkout session created successfully.",
		data: result,
	});
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
    const user = req.user!
	const result = await PaymentService.getMyPayments(
		user.userId,
		req.query,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Payments retrieved successfully.",
		meta: result.meta,
		data: result.data,
	});
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
    const user = req.user!
	const result = await PaymentService.getPaymentById(
		user.userId,
		req.params.id as string,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Payment retrieved successfully.",
		data: result,
	});
});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
    const user = req.user!
	const result = await PaymentService.confirmPayment(
		user.userId,
		req.body.sessionId,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Payment confirmed successfully.",
		data: result,
	});
});

export const PaymentController = {
	createPayment,
	confirmPayment,
	getMyPayments,
	getPaymentById,
};