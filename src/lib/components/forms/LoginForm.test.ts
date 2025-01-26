import { fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import LoginForm from './LoginForm.svelte';
import userEvent from '@testing-library/user-event';
import { goto } from '$app/navigation';
import { publicFetch } from '$lib/api/utils';

vi.mock('$app/navigation');
vi.mock('$lib/api/utils');

describe('LoginForm', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should display input error messages with invalid data format', async () => {
		const user = userEvent.setup();
		render(LoginForm);

		const nameInput = screen.getByTestId('name');
		await user.type(nameInput, '   ');

		const emailInput = screen.getByTestId('email');
		await user.type(emailInput, 'd.@com');

		const submitButton = screen.getByText('Login');
		await fireEvent.click(submitButton);

		expect(screen.getByTestId('input-validation-error-name')).not.toBeNull();
		expect(screen.getByTestId('input-validation-error-email')).not.toBeNull();
	});

	it('should display api response error messages with a non okay api call', async () => {
		const user = userEvent.setup();
		render(LoginForm);

		const mockStatus = 503;
		const mockApiResponseMessage = 'Server is undergoing maintenance';
		const expectedErrorMessage = `Failed authentication request: Status code ${mockStatus}, with message: ${mockApiResponseMessage}`;

		vi.mocked(publicFetch.post).mockRejectedValueOnce(new Error(expectedErrorMessage));

		const nameInput = screen.getByTestId('name');
		await user.type(nameInput, 'Daniel');

		const emailInput = screen.getByTestId('email');
		await user.type(emailInput, 'example@example.com');

		const submitButton = screen.getByText('Login');
		await fireEvent.click(submitButton);

		expect(screen.getByText(expectedErrorMessage)).not.toBeNull();
	});

	it('should redirect to index page after sucessful login', async () => {
		const user = userEvent.setup();
		render(LoginForm);

		vi.mocked(publicFetch.post).mockResolvedValueOnce({ ok: true });

		const nameInput = screen.getByTestId('name');
		await user.type(nameInput, 'Daniel');

		const emailInput = screen.getByTestId('email');
		await user.type(emailInput, 'example@example.com');

		const submitButton = screen.getByText('Login');
		await fireEvent.click(submitButton);

		expect(goto).toHaveBeenCalledWith('/');
	});
});
