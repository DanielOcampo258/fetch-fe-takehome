import type { LoginState } from './models';

export let loginState = $state<LoginState>({ isSubmitting: false, error: {} });
