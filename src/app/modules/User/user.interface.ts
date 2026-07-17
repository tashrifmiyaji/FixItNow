import { UserRole, UserStatus } from "../../../../generated/prisma/enums";

export interface IUpdateProfile {
	name?: string;
	phone?: string;
}

export interface IUpdateUserStatus {
	status: UserStatus;
}

export interface IGetUsersQuery {
	searchTerm?: string;
	role?: UserRole;
	status?: UserStatus;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}