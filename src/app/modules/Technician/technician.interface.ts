export interface ICreateTechnicianProfile {
	bio?: string;
	experience: number;
	location: string;
}

export interface IUpdateTechnicianProfile {
	bio?: string;
	experience?: number;
	location?: string;
}

export interface IGetTechniciansQuery {
	searchTerm?: string;
	location?: string;
	minRating?: number;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}