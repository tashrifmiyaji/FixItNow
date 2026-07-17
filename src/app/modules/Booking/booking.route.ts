import { Router } from "express";

import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";

import { BookingController } from "./booking.controller";
import { BookingValidation } from "./booking.validation";

import { UserRole } from "../../../../generated/prisma/enums";

const router = Router();

router.post(
	"/",
	auth(UserRole.CUSTOMER),
	validateRequest(BookingValidation.createBookingValidationSchema),
	BookingController.createBooking,
);

router.get(
	"/",
	auth(UserRole.CUSTOMER, UserRole.TECHNICIAN),
	BookingController.getMyBookings,
);

router.get(
	"/:id",
	auth(UserRole.CUSTOMER, UserRole.TECHNICIAN),
	BookingController.getBookingById,
);

router.patch(
	"/:id",
	auth(UserRole.TECHNICIAN),
	validateRequest(BookingValidation.updateBookingStatusValidationSchema),
	BookingController.updateBookingStatus,
);

export default router;
