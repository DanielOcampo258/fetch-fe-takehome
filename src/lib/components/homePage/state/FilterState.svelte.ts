import type { Dog } from '$lib/api/dogs/models';
import { SvelteSet } from 'svelte/reactivity';

interface Favorites {
	dogIds: SvelteSet<string>;
}

export class FavoritesState implements Favorites {
	dogIds = $state(new SvelteSet<string>());
	size = $derived(this.dogIds.size);

	#addToFavorites = (id: string) => {
		this.dogIds.add(id);
	};

	#removeFromFavories = (id: string) => {
		this.dogIds.delete(id);
	};

	toggleFavoriteState = (id: string) => {
		if (this.isFavorited(id)) {
			this.#removeFromFavories(id);
		} else {
			this.#addToFavorites(id);
		}
	};

	isFavorited = (id: string) => {
		return this.dogIds.has(id);
	};

	getAriaLabel = (dogData: Dog) => {
		if (this.isFavorited(dogData.id)) {
			return `Remove ${dogData.name}, ${dogData.breed}, located in zip code ${dogData.zip_code} from favorites list`;
		} else {
			return `Add ${dogData.name}, ${dogData.breed}, located in zip code ${dogData.zip_code} to favorites list`;
		}
	};
}
