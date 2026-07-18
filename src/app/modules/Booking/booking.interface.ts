import { BookingStatus } from "../../../../generated/prisma/enums.js";

export interface ICreateBooking {
	serviceId: string;
	bookingDate: Date;
}

export interface IUpdateBookingStatus {
	status: BookingStatus;
}

export interface IGetBookingsQuery {
	status?: BookingStatus;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}