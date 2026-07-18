import { UserStatus } from "../../../../generated/prisma/enums.js";

export interface IUpdateUserStatus {
	status: UserStatus;
}

export interface IGetUsersQuery {
	searchTerm?: string;
	role?: string;
	status?: UserStatus;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface IGetBookingsQuery {
	status?: string;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}
