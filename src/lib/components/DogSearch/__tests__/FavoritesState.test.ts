import { describe, expect, it } from 'vitest';
import { FavoritesState } from '../state/FavoritesState.svelte';
import { mockDogs } from '$lib/testUtils';

describe('FavoritesState', () => {
	it('should toggle between favorited states', () => {
		const favoritesState = new FavoritesState();

		favoritesState.toggleFavoriteState('my id');
		expect(Array.from(favoritesState.dogIds)).toEqual(['my id']);
		favoritesState.toggleFavoriteState('my id');
		expect(Array.from(favoritesState.dogIds)).toEqual([]);
	});

	it('should return the correct aria label given the favorited state', () => {
		const favoritesState = new FavoritesState();

		favoritesState.toggleFavoriteState(mockDogs[0].id);
		expect(favoritesState.getAriaLabel(mockDogs[0])).toContain('Remove');

		expect(favoritesState.getAriaLabel(mockDogs[2])).toContain('Add');
	});
});
