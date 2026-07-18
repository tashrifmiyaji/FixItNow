import {
	PaymentProvider,
	PaymentStatus,
} from "../../../../generated/prisma/enums";

export interface ICreatePayment {
	bookingId: string;
}

export interface IConfirmPayment {
	sessionId: string;
}

export interface IGetPaymentsQuery {
	status?: PaymentStatus;
	provider?: PaymentProvider;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}