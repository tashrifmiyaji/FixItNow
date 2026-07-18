import httpStatus from "http-status";

import prisma from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";

import {
	ICreateService,
	IGetServicesQuery,
	IUpdateService,
} from "./service.interface";

const createService = async (
	userId: string,
	payload: ICreateService,
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

	const category = await prisma.category.findUnique({
		where: {
			id: payload.categoryId,
		},
	});

	if (!category) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"Category not found.",
		);
	}

	const service = await prisma.service.create({
		data: {
			title: payload.title,
			description: payload.description,
			price: payload.price,
			categoryId: payload.categoryId,
			technicianId: technician.id,
		},
		include: {
			category: true,
			technician: true,
		},
	});

	return service;
};

const getAllServices = async (
	query: IGetServicesQuery,
) => {
	const page = Number(query.page) || 1;
	const limit = Number(query.limit) || 10;
	const skip = (page - 1) * limit;

	const where = {
		...(query.searchTerm && {
			OR: [
				{
					title: {
						contains: query.searchTerm,
						mode: "insensitive" as const,
					},
				},
				{
					description: {
						contains: query.searchTerm,
						mode: "insensitive" as const,
					},
				},
			],
		}),

		...(query.categoryId && {
			categoryId: query.categoryId,
		}),

		...(query.minPrice || query.maxPrice
			? {
					price: {
						...(query.minPrice && {
							gte: Number(query.minPrice),
						}),
						...(query.maxPrice && {
							lte: Number(query.maxPrice),
						}),
					},
				}
			: {}),

		...(query.location && {
			technician: {
				location: {
					contains: query.location,
					mode: "insensitive" as const,
				},
			},
		}),
	};

	const [services, total] = await Promise.all([
		prisma.service.findMany({
			where,
			skip,
			take: limit,
			include: {
				category: true,
				technician: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								email: true,
							},
						},
					},
				},
			},
			orderBy: {
				[query.sortBy || "createdAt"]:
					query.sortOrder || "desc",
			},
		}),

		prisma.service.count({
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
		data: services,
	};
};

const getServiceById = async (id: string) => {
	const service = await prisma.service.findUnique({
		where: {
			id,
		},
		include: {
			category: true,
			technician: {
				include: {
					user: true,
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
			},
		},
	});

	if (!service) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"Service not found.",
		);
	}

	return service;
};

const updateService = async (
	userId: string,
	id: string,
	payload: IUpdateService,
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

	const service = await prisma.service.findFirst({
		where: {
			id,
			technicianId: technician.id,
		},
	});

	if (!service) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"Service not found.",
		);
	}

	if (payload.categoryId) {
		const category = await prisma.category.findUnique({
			where: {
				id: payload.categoryId,
			},
		});

		if (!category) {
			throw new AppError(
				httpStatus.NOT_FOUND,
				"Category not found.",
			);
		}
	}

	return prisma.service.update({
		where: {
			id,
		},
		data: payload,
		include: {
			category: true,
		},
	});
};

const deleteService = async (
	userId: string,
	id: string,
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

	const service = await prisma.service.findFirst({
		where: {
			id,
			technicianId: technician.id,
		},
		include: {
			bookings: true,
		},
	});

	if (!service) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"Service not found.",
		);
	}

	if (service.bookings.length > 0) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Service cannot be deleted because it has bookings.",
		);
	}

	await prisma.service.delete({
		where: {
			id,
		},
	});

	return null;
};

export const ServiceService = {
	createService,
	getAllServices,
	getServiceById,
	updateService,
	deleteService,
};