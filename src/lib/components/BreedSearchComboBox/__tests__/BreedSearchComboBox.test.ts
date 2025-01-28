import { afterEach, describe, expect, it, vi } from 'vitest';
import { screen, render, fireEvent } from '@testing-library/svelte';
import BreedSearchComboBox from '../BreedSearchComboBox.svelte';
import { FilterState } from '$lib/components/FilteringComponent/state/FilterQueryState.svelte';

const mockBreeds = ['Affenpinscher', 'Borzoi', 'Vizsla', 'Redbone', 'German Shepherd'];

describe('BreedSearchComboBox', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should show the text 'Any' on the button trigger when no breeds have been selected", () => {
		const filterState = new FilterState();

		render(BreedSearchComboBox, { allDogBreeds: mockBreeds, filterState });
		const comboboxTrigger = screen.getByLabelText('Breeds');

		expect(comboboxTrigger.textContent).toBe('Any');
	});

	it('should focus onto the input search when checkbox is selected', async () => {
		const filterState = new FilterState();

		render(BreedSearchComboBox, { allDogBreeds: mockBreeds, filterState });

		// Open combobox to see search bar
		const comboboxTrigger = screen.getByLabelText('Breeds');
		await fireEvent.click(comboboxTrigger);

		const searchInput = screen.getByTestId('breed-search-input');
		const focusSpy = vi.spyOn(searchInput, 'focus');

		const affenpinscherCheckBox = screen.getByTestId(`${mockBreeds[0]}-checkbox`);
		await fireEvent.click(affenpinscherCheckBox);

		expect(focusSpy).toHaveBeenCalled();
	});

	it('should increase selected breeds and update button trigger text when corresponding checkbox checked', async () => {
		const filterState = new FilterState();

		render(BreedSearchComboBox, { allDogBreeds: mockBreeds, filterState });

		// Trigger combobox to open
		const comboboxTrigger = screen.getByLabelText('Breeds');
		await fireEvent.click(comboboxTrigger);

		// Check Affenpinscher checkbox to add to state
		const affenpinscherCheckBox = screen.getByTestId(`${mockBreeds[0]}-checkbox`);
		await fireEvent.click(affenpinscherCheckBox);

		expect(filterState.breeds).toEqual([mockBreeds[0]]);
		expect(comboboxTrigger.textContent).toBe('Selected breed(s): 1');
	});

	it('should decrease the number of selected breeds and update trigger text when corresponding checkbox is unchecked', async () => {
		const filterState = new FilterState();

		render(BreedSearchComboBox, { allDogBreeds: mockBreeds, filterState });

		// Trigger combobox to open
		const comboboxTrigger = screen.getByLabelText('Breeds');
		await fireEvent.click(comboboxTrigger);

		// Add two breeds
		const affenpinscherCheckBox = screen.getByTestId(`${mockBreeds[0]}-checkbox`);
		await fireEvent.click(affenpinscherCheckBox);
		const redBoneCheckBox = screen.getByTestId(`${mockBreeds[3]}-checkbox`);
		await fireEvent.click(redBoneCheckBox);

		expect(comboboxTrigger.textContent).toBe('Selected breed(s): 2');
		expect(filterState.breeds).toEqual([mockBreeds[0], mockBreeds[3]]);

		// Uncheck Affenpinscher
		await fireEvent.click(affenpinscherCheckBox);

		expect(comboboxTrigger.textContent).toBe('Selected breed(s): 1');
		expect(filterState.breeds).toEqual([mockBreeds[3]]);
	});
});
