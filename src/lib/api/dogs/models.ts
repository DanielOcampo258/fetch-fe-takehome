export interface DogSeachQuery {
	breeds: string[];
	zipCodes: string[];
	ageMin: number | null;
	ageMax: number | null;
	size: number;
	from: number;
	sort: string | null;
}

export interface DogSeachApiResponse {
	resultIds: string[];
	total: number;
	next: number | null;
	prev: number | null;
}

export interface Dog {
	id: string;
	img: string;
	name: string;
	age: number;
	zip_code: string;
	breed: string;
}
