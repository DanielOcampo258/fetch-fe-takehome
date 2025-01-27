import { fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Logout from '../Logout.svelte';
import { authenticatedFetch } from '$lib/api/utils';
import { AuthRoutes } from '$lib/api/auth/constants';
import { goto } from '$app/navigation';

vi.mock('$lib/api/utils');
vi.mock('$app/navigation');

describe('Logout', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should call logout on logout button click and redirect to login page', async () => {
		render(Logout);
		const logoutButton = screen.getByRole('button', { name: 'Logout' });

		await fireEvent.click(logoutButton);

		expect(authenticatedFetch.post).toHaveBeenCalledWith(AuthRoutes.Logout);
		expect(goto).toHaveBeenCalledWith('/login');
	});
});
