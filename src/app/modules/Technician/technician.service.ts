import httpStatus from "http-status";

import prisma from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";

import {
	ICreateTechnicianProfile,
	IGetTechniciansQuery,
	IUpdateTechnicianProfile,
} from "./technician.interface";

const createProfile = async (
	userId: string,
	payload: ICreateTechnicianProfile,
) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
	});

	if (!user) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"User not found.",
		);
	}

	const profileExists = await prisma.technicianProfile.findUnique({
		where: {
			userId,
		},
	});

	if (profileExists) {
		throw new AppError(
			httpStatus.CONFLICT,
			"Technician profile already exists.",
		);
	}

	return prisma.technicianProfile.create({
		data: {
			userId,
			bio: payload.bio,
			experience: payload.experience,
			location: payload.location,
		},
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
					phone: true,
				},
			},
		},
	});
};

const updateProfile = async (
	userId: string,
	payload: IUpdateTechnicianProfile,
) => {
	const profile = await prisma.technicianProfile.findUnique({
		where: {
			userId,
		},
	});

	if (!profile) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"Technician profile not found.",
		);
	}

	return prisma.technicianProfile.update({
		where: {
			userId,
		},
		data: payload,
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
					phone: true,
				},
			},
		},
	});
};

const getAllTechnicians = async (
	query: IGetTechniciansQuery,
) => {
	const page = Number(query.page) || 1;
	const limit = Number(query.limit) || 10;
	const skip = (page - 1) * limit;

	const where = {
		...(query.location && {
			location: {
				contains: query.location,
				mode: "insensitive" as const,
			},
		}),

		...(query.minRating && {
			averageRating: {
				gte: Number(query.minRating),
			},
		}),

		...(query.searchTerm && {
			user: {
				name: {
					contains: query.searchTerm,
					mode: "insensitive" as const,
				},
			},
		}),
	};

	const [technicians, total] = await Promise.all([
		prisma.technicianProfile.findMany({
			where,
			skip,
			take: limit,
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						phone: true,
					},
				},
				services: true,
			},
			orderBy: {
				[query.sortBy || "createdAt"]:
					query.sortOrder || "desc",
			},
		}),

		prisma.technicianProfile.count({
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
		data: technicians,
	};
};

const getTechnicianById = async (id: string) => {
	const technician = await prisma.technicianProfile.findUnique({
		where: {
			id,
		},
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
					phone: true,
				},
			},
			services: true,
			reviews: {
				include: {
					customer: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			},
		},
	});

	if (!technician) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"Technician not found.",
		);
	}

	return technician;
};

export const TechnicianService = {
	createProfile,
	updateProfile,
	getAllTechnicians,
	getTechnicianById,
};