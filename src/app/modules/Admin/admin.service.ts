import httpStatus from "http-status";

import prisma from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";

import {
	IGetBookingsQuery,
	IGetUsersQuery,
	IUpdateUserStatus,
} from "./admin.interface";

const getAllUsers = async (query: IGetUsersQuery) => {
	const page = Number(query.page) || 1;
	const limit = Number(query.limit) || 10;
	const skip = (page - 1) * limit;

	const where = {
		...(query.role && {
			role: query.role as any,
		}),

		...(query.status && {
			status: query.status,
		}),

		...(query.searchTerm && {
			OR: [
				{
					name: {
						contains: query.searchTerm,
						mode: "insensitive" as const,
					},
				},
				{
					email: {
						contains: query.searchTerm,
						mode: "insensitive" as const,
					},
				},
			],
		}),
	};

	const [users, total] = await Promise.all([
		prisma.user.findMany({
			where,
			skip,
			take: limit,
			orderBy: {
				[query.sortBy || "createdAt"]:
					query.sortOrder || "desc",
			},
			select: {
				id: true,
				name: true,
				email: true,
				phone: true,
				role: true,
				status: true,
				createdAt: true,
			},
		}),

		prisma.user.count({
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
		data: users,
	};
};

const updateUserStatus = async (
	id: string,
	payload: IUpdateUserStatus,
) => {
	const user = await prisma.user.findUnique({
		where: {
			id,
		},
	});

	if (!user) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"User not found.",
		);
	}

	return prisma.user.update({
		where: {
			id,
		},
		data: {
			status: payload.status,
		},
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			status: true,
			updatedAt: true,
		},
	});
};

const getAllBookings = async (
	query: IGetBookingsQuery,
) => {
	const page = Number(query.page) || 1;
	const limit = Number(query.limit) || 10;
	const skip = (page - 1) * limit;

	const where = {
		...(query.status && {
			status: query.status as any,
		}),
	};

	const [bookings, total] = await Promise.all([
		prisma.booking.findMany({
			where,
			skip,
			take: limit,
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
			orderBy: {
				[query.sortBy || "createdAt"]:
					query.sortOrder || "desc",
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

export const AdminService = {
	getAllUsers,
	updateUserStatus,
	getAllBookings,
};