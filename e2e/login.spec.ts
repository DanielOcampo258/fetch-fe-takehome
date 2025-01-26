import { test, expect } from '@playwright/test';

enum AuthRoutes {
	Login = 'auth/login'
}

test.describe('Login Page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/login');
	});

	test('should display login form with all elements', async ({ page }) => {
		await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

		await expect(page.getByLabel('Name')).toBeVisible();
		await expect(page.getByLabel('Email')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
	});

	test('should have name and email input fields have a required attribute', async ({ page }) => {
		const submitButton = page.getByRole('button', { name: 'Login' });
		await submitButton.click();

		const nameInput = page.getByLabel('Name');
		const emailInput = page.getByLabel('Email');

		await expect(nameInput).toHaveAttribute('required', '');
		await expect(emailInput).toHaveAttribute('required', '');
	});

	test('should display name input validation error message and re-enable submit button', async ({
		page
	}) => {
		const nameInput = page.getByLabel('Name');
		const emailInput = page.getByLabel('Email');
		const submitButton = page.getByRole('button', { name: 'Login' });

		await nameInput.fill('  ');
		await emailInput.fill('example@example.com');

		await submitButton.click();

		await expect(
			page.getByText('Name field must contain at least one non-whitespace character.')
		).toBeVisible();
		await expect(submitButton).toBeEnabled();
	});

	test('should display email input validation error message and re-enable submit button', async ({
		page
	}) => {
		const nameInput = page.getByLabel('Name');
		const emailInput = page.getByLabel('Email');
		const submitButton = page.getByRole('button', { name: 'Login' });

		await nameInput.fill('My name');
		await emailInput.fill('dasd@dsad');

		await submitButton.click();

		await expect(submitButton).toBeEnabled();
		await expect(page.getByText('Please enter a valid email address')).toBeVisible();
	});

	test('should display API error message and re-enable submit button', async ({ page }) => {
		const nameInput = page.getByLabel('Name');
		const emailInput = page.getByLabel('Email');
		const submitButton = page.getByRole('button', { name: 'Login' });

		await nameInput.fill('batman');
		await emailInput.fill('bruce@wayne.com');

		const mockStatusCode = 401;

		await page.route(`**/${AuthRoutes.Login}`, async (route) => {
			await route.fulfill({
				status: mockStatusCode
			});
		});

		await submitButton.click();

		await expect(page.getByText(`Request failed with status code ${mockStatusCode}`)).toBeVisible();
		await expect(submitButton).toBeEnabled();
	});

	test('should handle successful login', async ({ page }) => {
		const nameInput = page.getByLabel('Name');
		const emailInput = page.getByLabel('Email');

		await nameInput.fill('Kratos');
		await emailInput.fill('kratos@example.com');

		await page.route(`**/${AuthRoutes.Login}`, async (route) => {
			await route.fulfill({
				status: 200
			});
		});

		await page.getByRole('button', { name: 'Login' }).click();

		// Verify redirect to home page
		await expect(page).toHaveURL('/');
	});

	test('should disable submit button while submitting', async ({ page }) => {
		const nameInput = page.getByLabel('Name');
		const emailInput = page.getByLabel('Email');

		const submitButton = page.getByRole('button', { name: 'Login' });

		await nameInput.fill('Alan Wake');
		await emailInput.fill('saga@fbc.com');

		await page.route(`**/${AuthRoutes.Login}`, async (route) => {
			await route.fulfill({ status: 200 });
		});

		await submitButton.click();
		await expect(submitButton).toBeDisabled();
	});
});
