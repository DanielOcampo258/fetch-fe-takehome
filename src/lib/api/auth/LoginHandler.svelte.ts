import { goto } from '$app/navigation';
import { API_BASE_URL } from '$lib/api/constants';
import { AuthRoutes } from './constants';
import { LoginSchema, type LoginData, type LoginError, type LoginState } from './models';

export class LoginHandler implements LoginState {
	isSubmitting = $state(false);
	error = $state<LoginError>({});

	validateLoginData(form: FormData) {
		const data = Object.fromEntries(form);
		const parsingResult = LoginSchema.safeParse(data);

		// Set error state on invalid data
		if (!parsingResult.success) {
			this.error.validation = parsingResult.error.format();
			return null;
		}

		return parsingResult.data;
	}

	//TODO: ADD TESTS
	loginUser = async (credentials: LoginData) => {
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
			this.isSubmitting = false;

			if (error instanceof Error) {
				this.error.apiResponse = error.message;
			} else {
				this.error.apiResponse = 'Failed authentication request: Unknown cause';
			}
		}
	};
}
