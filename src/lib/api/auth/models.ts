import { z, type ZodFormattedError } from 'zod';

export const LoginSchema = z.object({
	name: z
		.string()
		.trim()
		.nonempty('Name field must contain at least one non-whitespace character.'),
	email: z.string().trim().email('Please enter a valid email address')
});

export type LoginData = z.infer<typeof LoginSchema>;

export interface LoginState {
	isSubmitting: boolean;
	error: LoginError;
}

export interface LoginError {
	validation?: ZodFormattedError<LoginData>;
	apiResponse?: string;
}
