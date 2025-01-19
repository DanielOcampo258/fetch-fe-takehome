import { z, type ZodFormattedError } from 'zod';

export const LoginSchema = z.object({
	name: z.string().trim().nonempty(),
	email: z.string().trim().email()
});

export type LoginData = z.infer<typeof LoginSchema>;

export interface LoginState {
	isSubmitting: boolean;
	error: LoginError;
}

interface LoginError {
	validation?: ZodFormattedError<LoginData>;
	apiResponse?: string;
}
