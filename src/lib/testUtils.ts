import type { Dog } from '$lib/api/dogs/models';

export const mockDogs: Dog[] = [
	{
		id: '1',
		img: 'https://example.com/dog1.jpg',
		name: 'Maeby',
		age: 3,
		zip_code: '90210',
		breed: 'Golden Retriever'
	},
	{
		id: '2',
		img: 'https://example.com/dog2.jpg',
		name: 'Luna',
		age: 2,
		zip_code: '30303',
		breed: 'Labrador Retriever'
	},
	{
		id: '3',
		img: 'https://example.com/dog3.jpg',
		name: 'Charlie',
		age: 5,
		zip_code: '60606',
		breed: 'Beagle'
	},
	{
		id: '4',
		img: 'https://example.com/dog4.jpg',
		name: 'Rose',
		age: 4,
		zip_code: '10001',
		breed: 'Poodle'
	}
];

export function generateMockDogs(quantity: number): Dog[] {
	return [...Array(quantity).keys()].map((index) => {
		return {
			id: `dog-id-${index}`,
			img: `dog-img-${index}`,
			name: `${mockDogs[index % mockDogs.length].name}-${index}`,
			age: index,
			zip_code: mockDogs[index % mockDogs.length].zip_code,
			breed: mockDogs[index % mockDogs.length].breed
		};
	});
}
