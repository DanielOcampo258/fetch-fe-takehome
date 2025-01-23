import { afterEach, describe, expect, it, vi } from 'vitest';
import { LoginHandler } from './LoginHandler.svelte';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('LoginHandler', () => {
	describe('validateLoginData', () => {
		it('should set error state and return null on invalid data', () => {
			const loginHandler = new LoginHandler();
			expect(loginHandler.error.validation).toBeFalsy();

			const incorrectFormData = new FormData();
			incorrectFormData.set('name', '  ');
			incorrectFormData.set('email', 'this is def a valid email');

			const result = loginHandler.validateLoginData(incorrectFormData);

			expect(loginHandler.error.validation).toBeTruthy();
			expect(result).toBeNull();
		});

		it('should not set error state and return valid object on valid form data', () => {
			const loginHandler = new LoginHandler();

			const correctFormData = new FormData();
			correctFormData.set('name', 'Daniel');
			correctFormData.set('email', 'example@example.com');

			const result = loginHandler.validateLoginData(correctFormData);

			expect(loginHandler.error.validation).toBeFalsy();
			expect(result).toEqual({
				name: 'Daniel',
				email: 'example@example.com'
			});
		});
	});

	describe('loginUser', () => {
		afterEach(() => {
			mockFetch.mockRestore();
		});

		it('should set error response state message if response does not return back with ok status', async () => {
			const loginHandler = new LoginHandler();
			const mockStatus = 500;
			const mockApiResponseMessage = 'Server is down :(';
			const expectedErrorMessage = `Failed authentication request: Status code ${mockStatus}, with message: ${mockApiResponseMessage}`;

			const mockResponse = {
				ok: false,
				status: mockStatus,
				text: vi.fn().mockResolvedValueOnce(mockApiResponseMessage)
			};

			mockFetch.mockResolvedValueOnce(mockResponse);

			await loginHandler.loginUser({
				name: 'Daniel',
				email: 'example@example.com'
			});

			expect(loginHandler.error.apiResponse).toEqual(expectedErrorMessage);
		});
	});
});
