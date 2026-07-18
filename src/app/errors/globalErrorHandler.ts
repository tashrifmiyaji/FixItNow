import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { Prisma } from "../../../generated/prisma/client.js";

import AppError from "./AppError";
import handlePrismaError from "./handlePrismaError";
import handleZodError from "./handleZodError";

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
	let statusCode = 500;

	let message = "Something went wrong!";

	let errorDetails = [
		{
			path: "",
			message: "Internal Server Error",
		},
	];

	// Prisma Error
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		const simplifiedError = handlePrismaError(error);

		statusCode = simplifiedError.statusCode;
		message = simplifiedError.message;
		errorDetails = simplifiedError.errorDetails;
	}

	// Zod Error
	else if (error instanceof ZodError) {
		const simplifiedError = handleZodError(error);

		statusCode = simplifiedError.statusCode;
		message = simplifiedError.message;
		errorDetails = simplifiedError.errorDetails;
	}

	// Custom App Error
	else if (error instanceof AppError) {
		statusCode = error.statusCode;

		message = error.message;

		errorDetails = [
			{
				path: "",
				message: error.message,
			},
		];
	}

	// Unknown Error
	else if (error instanceof Error) {
		message = error.message;

		errorDetails = [
			{
				path: "",
				message: error.message,
			},
		];
	}

	return res.status(statusCode).json({
		success: false,
		statusCode,
		message,
		errorDetails,
	});
};

export default globalErrorHandler;
