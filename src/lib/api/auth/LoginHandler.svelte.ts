import { AuthRoutes } from './constants';
import { LoginSchema, type LoginData, type LoginError, type LoginState } from './models';
import { publicFetch } from '../utils';

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

	loginUser = async (credentials: LoginData) => {
		try {
			await publicFetch.post(AuthRoutes.Login, credentials, {
				withCredentials: true
			});
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
