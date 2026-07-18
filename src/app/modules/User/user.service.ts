import httpStatus from "http-status";

import prisma from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";

import { IGetUsersQuery, IUpdateProfile } from "./user.interface";

const getMyProfile = async (userId: string) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		select: {
			id: true,
			name: true,
			email: true,
			phone: true,
			role: true,
			status: true,
			technicianProfile: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found.");
	}

	return user;
};

const updateMyProfile = async (userId: string, payload: IUpdateProfile) => {
	const isUserExists = await prisma.user.findUnique({
		where: {
			id: userId,
		},
	});

	if (!isUserExists) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found.");
	}

	const updatedUser = await prisma.user.update({
		where: {
			id: userId,
		},
		data: payload,
		select: {
			id: true,
			name: true,
			email: true,
			phone: true,
			role: true,
			status: true,
			updatedAt: true,
		},
	});

	return updatedUser;
};

const getAllUsers = async (query: IGetUsersQuery) => {
	const page = Number(query.page) || 1;
	const limit = Number(query.limit) || 10;
	const skip = (page - 1) * limit;

	const where = {
		...(query.role && {
			role: query.role,
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
				[query.sortBy || "createdAt"]: query.sortOrder || "desc",
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

export const UserService = {
	getMyProfile,
	updateMyProfile,
	getAllUsers,
};
