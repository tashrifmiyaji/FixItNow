export interface ICreateReview {
	bookingId: string;
	rating: number;
	comment?: string;
}

export interface IUpdateReview {
	rating?: number;
	comment?: string;
}

export interface IGetReviewsQuery {
	technicianId?: string;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}