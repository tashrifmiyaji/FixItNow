import httpStatus from "http-status";

import prisma from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";

import { BookingStatus, UserRole } from "../../../../generated/prisma/enums.js";

import {
	ICreateBooking,
	IGetBookingsQuery,
	IUpdateBookingStatus,
} from "./booking.interface";

const createBooking = async (userId: string, payload: ICreateBooking) => {
	const service = await prisma.service.findUnique({
		where: {
			id: payload.serviceId,
		},
	});

	if (!service) {
		throw new AppError(httpStatus.NOT_FOUND, "Service not found.");
	}

	const booking = await prisma.booking.create({
		data: {
			customerId: userId,
			technicianId: service.technicianId,
			serviceId: service.id,
			bookingDate: payload.bookingDate,
		},
		include: {
			customer: {
				omit: {
					password: true,
				},
			},
			technician: {
				include: {
					user: {
						omit: {
							password: true,
						},
					},
				},
			},
			service: true,
		},
	});

	return booking;
};

const getMyBookings = async (
	userId: string,
	role: UserRole,
	query: IGetBookingsQuery,
) => {
	const page = Number(query.page) || 1;
	const limit = Number(query.limit) || 10;
	const skip = (page - 1) * limit;

	const technician = await prisma.technicianProfile.findUnique({
		where: {
			userId,
		},
		select: {
			id: true,
		},
	});

	const where = {
		...(role === UserRole.CUSTOMER && {
			customerId: userId,
		}),

		...(role === UserRole.TECHNICIAN &&
			technician && {
				technicianId: technician.id,
			}),

		...(query.status && {
			status: query.status,
		}),
	};

	const [bookings, total] = await Promise.all([
		prisma.booking.findMany({
			where,
			skip,
			take: limit,
			include: {
				customer: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
				technician: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
							},
						},
					},
				},
				service: true,
				payment: true,
				review: true,
			},
			orderBy: {
				[query.sortBy || "createdAt"]: query.sortOrder || "desc",
			},
		}),

		prisma.booking.count({
			where,
		}),
	]);

	return {
		meta: {
			page,
			limit,
			total,
			totalPage: Math.ceil(total / limit),
		},
		data: bookings,
	};
};

const getBookingById = async (userId: string, role: UserRole, id: string) => {
	const technician = await prisma.technicianProfile.findUnique({
		where: {
			userId,
		},
		select: {
			id: true,
		},
	});

	const booking = await prisma.booking.findFirst({
		where: {
			id,

			OR: [
				{
					customerId: userId,
				},
				...(role === UserRole.TECHNICIAN && technician
					? [
							{
								technicianId: technician.id,
							},
						]
					: []),
			],
		},
		include: {
			customer: true,
			technician: {
				include: {
					user: true,
				},
			},
			service: true,
			payment: true,
			review: true,
		},
	});

	if (!booking) {
		throw new AppError(httpStatus.NOT_FOUND, "Booking not found.");
	}

	return booking;
};

const updateBookingStatus = async (
	userId: string,
	id: string,
	payload: IUpdateBookingStatus,
) => {
	const technician = await prisma.technicianProfile.findUnique({
		where: {
			userId,
		},
	});

	if (!technician) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"Technician profile not found.",
		);
	}

	const booking = await prisma.booking.findFirst({
		where: {
			id,
			technicianId: technician.id,
		},
	});

	if (!booking) {
		throw new AppError(httpStatus.NOT_FOUND, "Booking not found.");
	}

	if (
		booking.status === BookingStatus.COMPLETED ||
		booking.status === BookingStatus.CANCELLED
	) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Booking can no longer be updated.",
		);
	}

	return prisma.booking.update({
		where: {
			id,
		},
		data: {
			status: payload.status,
		},
		include: {
			customer: true,
			service: true,
		},
	});
};

export const BookingService = {
	createBooking,
	getMyBookings,
	getBookingById,
	updateBookingStatus,
};
