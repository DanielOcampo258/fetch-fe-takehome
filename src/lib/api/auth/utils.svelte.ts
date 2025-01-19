import { goto } from '$app/navigation';
import { API_BASE_URL } from '../constants';
import { AuthRoutes } from './constants';
import { LoginSchema, type LoginData, type LoginState } from './models';

export let loginFormState = $state<LoginState>({ isSubmitting: false, error: {} });

export function validateLoginData(form: FormData) {
	const data = Object.fromEntries(form);
	const parsingResult = LoginSchema.safeParse(data);

	// Set error state on invalid data
	if (!parsingResult.success) {
		loginFormState.error.validation = parsingResult.error.format();
		return null;
	}

	return parsingResult.data;
}

//TODO: ADD TESTS
export async function loginUser(credentials: LoginData) {
	try {
		//TODO: Centralize fetch calls in hook to set base url and request config in one place
		const res = await fetch(`${API_BASE_URL}/${AuthRoutes.Login}`, {
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(credentials)
		});

		if (!res.ok) {
			const apiMessage = await res.text();
			throw new Error(
				`Failed authentication request: Status code ${res.status}, with message: ${apiMessage}`
			);
		}

		goto('/');
	} catch (error: unknown) {
		loginFormState.isSubmitting = false;

		if (error instanceof Error) {
			loginFormState.error.apiResponse = error.message;
		} else {
			loginFormState.error.apiResponse = 'Failed authentication request: Unknown cause';
		}
	}
}
