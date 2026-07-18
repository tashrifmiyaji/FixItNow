import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";

import { BookingService } from "./booking.service";

const createBooking = catchAsync(async (req: Request, res: Response) => {
    const user = req.user!
	const result = await BookingService.createBooking(
		user.userId,
		req.body,
	);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Booking created successfully.",
		data: result,
	});
});

const getMyBookings = catchAsync(async (req: Request, res: Response) => {
     const user = req.user!
	const result = await BookingService.getMyBookings(
		user.userId,
		user.role,
		req.query,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Bookings retrieved successfully.",
		meta: result.meta,
		data: result.data,
	});
});

const getBookingById = catchAsync(async (req: Request, res: Response) => {
     const user = req.user!
	const result = await BookingService.getBookingById(
		user.userId,
		user.role,
		req.params.id as string,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Booking retrieved successfully.",
		data: result,
	});
});

const updateBookingStatus = catchAsync(
	async (req: Request, res: Response) => {
         const user = req.user!
		const result = await BookingService.updateBookingStatus(
			user.userId,
			req.params.id as string,
			req.body,
		);

		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: "Booking status updated successfully.",
			data: result,
		});
	},
);

export const BookingController = {
	createBooking,
	getMyBookings,
	getBookingById,
	updateBookingStatus,
};