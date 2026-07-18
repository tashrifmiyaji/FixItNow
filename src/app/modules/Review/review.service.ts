import httpStatus from "http-status";

import prisma from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";

import {
	ICreateReview,
	IGetReviewsQuery,
	IUpdateReview,
} from "./review.interface";

const createReview = async (
	userId: string,
	payload: ICreateReview,
) => {
	const booking = await prisma.booking.findUnique({
		where: {
			id: payload.bookingId,
		},
		include: {
			review: true,
			technician: true,
		},
	});

	if (!booking) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"Booking not found.",
		);
	}

	if (booking.customerId !== userId) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"You are not authorized to review this booking.",
		);
	}

	if (booking.review) {
		throw new AppError(
			httpStatus.CONFLICT,
			"Review already exists for this booking.",
		);
	}

	const review = await prisma.$transaction(async (tx) => {
		const createdReview = await tx.review.create({
			data: {
				bookingId: booking.id,
				customerId: userId,
				technicianId: booking.technicianId,
				rating: payload.rating,
				comment: payload.comment,
			},
			include: {
				customer: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		});

		const reviews = await tx.review.findMany({
			where: {
				technicianId: booking.technicianId,
			},
			select: {
				rating: true,
			},
		});

		const averageRating =
			reviews.reduce(
				(sum, review) => sum + review.rating,
				0,
			) / reviews.length;

		await tx.technicianProfile.update({
			where: {
				id: booking.technicianId,
			},
			data: {
				averageRating,
			},
		});

		return createdReview;
	});

	return review;
};

const getAllReviews = async (
	query: IGetReviewsQuery,
) => {
	const page = Number(query.page) || 1;
	const limit = Number(query.limit) || 10;
	const skip = (page - 1) * limit;

	const where = {
		...(query.technicianId && {
			technicianId: query.technicianId,
		}),
	};

	const [reviews, total] = await Promise.all([
		prisma.review.findMany({
			where,
			skip,
			take: limit,
			include: {
				customer: {
					select: {
						id: true,
						name: true,
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
				booking: true,
			},
			orderBy: {
				[query.sortBy || "createdAt"]:
					query.sortOrder || "desc",
			},
		}),

		prisma.review.count({
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
		data: reviews,
	};
};

const updateReview = async (
	userId: string,
	id: string,
	payload: IUpdateReview,
) => {
	const review = await prisma.review.findUnique({
		where: {
			id,
		},
	});

	if (!review) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"Review not found.",
		);
	}

	if (review.customerId !== userId) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"You are not authorized to update this review.",
		);
	}

	const updatedReview = await prisma.review.update({
		where: {
			id,
		},
		data: payload,
	});

	const reviews = await prisma.review.findMany({
		where: {
			technicianId: review.technicianId,
		},
		select: {
			rating: true,
		},
	});

	const averageRating =
		reviews.reduce(
			(sum, item) => sum + item.rating,
			0,
		) / reviews.length;

	await prisma.technicianProfile.update({
		where: {
			id: review.technicianId,
		},
		data: {
			averageRating,
		},
	});

	return updatedReview;
};

export const ReviewService = {
	createReview,
	getAllReviews,
	updateReview,
};