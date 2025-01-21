interface FilterOptions {
	selectedBreeds: string[];
	minAge: number | null;
	maxAge: number | null;
	zipCodes: string | null;
}

const INITIAL_EMPTY_FILTER: FilterOptions = {
	selectedBreeds: [],
	minAge: null,
	maxAge: null,
	zipCodes: null
};

export class FilterState {
	selectedBreeds = $state(INITIAL_EMPTY_FILTER.selectedBreeds);
	minAge = $state(INITIAL_EMPTY_FILTER.minAge);
	maxAge = $state(INITIAL_EMPTY_FILTER.maxAge);
	zipCodes = $state(INITIAL_EMPTY_FILTER.zipCodes);

	addSelectedBreed = (newBreed: string) => {
		this.selectedBreeds = [...this.selectedBreeds, newBreed];
	};

	removeSelectedBreed = (breedToRemove: string) => {
		this.selectedBreeds = this.selectedBreeds.filter((breed) => breed !== breedToRemove);
	};
}
