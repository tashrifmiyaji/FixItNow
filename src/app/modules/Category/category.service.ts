import httpStatus from "http-status";

import prisma from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";

import {
	ICreateCategory,
	IGetCategoriesQuery,
	IUpdateCategory,
} from "./category.interface";

const createCategory = async (payload: ICreateCategory) => {
	const isCategoryExists = await prisma.category.findUnique({
		where: {
			name: payload.name,
		},
	});

	if (isCategoryExists) {
		throw new AppError(
			httpStatus.CONFLICT,
			"Category already exists.",
		);
	}

	const category = await prisma.category.create({
		data: payload,
	});

	return category;
};

const getAllCategories = async (
	query: IGetCategoriesQuery,
) => {
	const page = Number(query.page) || 1;
	const limit = Number(query.limit) || 10;
	const skip = (page - 1) * limit;

	const where = {
		...(query.searchTerm && {
			name: {
				contains: query.searchTerm,
				mode: "insensitive" as const,
			},
		}),
	};

	const [categories, total] = await Promise.all([
		prisma.category.findMany({
			where,
			skip,
			take: limit,
			orderBy: {
				[query.sortBy || "createdAt"]:
					query.sortOrder || "desc",
			},
		}),

		prisma.category.count({
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
		data: categories,
	};
};

const getCategoryById = async (id: string) => {
	const category = await prisma.category.findUnique({
		where: {
			id,
		},
	});

	if (!category) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"Category not found.",
		);
	}

	return category;
};

const updateCategory = async (
	id: string,
	payload: IUpdateCategory,
) => {
	const isCategoryExists = await prisma.category.findUnique({
		where: {
			id,
		},
	});

	if (!isCategoryExists) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"Category not found.",
		);
	}

	const category = await prisma.category.update({
		where: {
			id,
		},
		data: payload,
	});

	return category;
};

const deleteCategory = async (id: string) => {
	const isCategoryExists = await prisma.category.findUnique({
		where: {
			id,
		},
		include: {
			services: true,
		},
	});

	if (!isCategoryExists) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"Category not found.",
		);
	}

	if (isCategoryExists.services.length > 0) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Cannot delete category because it contains services.",
		);
	}

	await prisma.category.delete({
		where: {
			id,
		},
	});

	return null;
};

export const CategoryService = {
	createCategory,
	getAllCategories,
	getCategoryById,
	updateCategory,
	deleteCategory,
};