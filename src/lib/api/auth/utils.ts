import { LoginSchema } from './models';

export function validateLoginData(form: FormData) {
	const data = Object.fromEntries(form);
	return LoginSchema.safeParse(data);
}

//TODO: Implement api request to login
