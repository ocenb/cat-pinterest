export const regex = {
	password: /^[\w!@#$%^&*?-]*$/,
	login: /^[a-zA-Z0-9_-]+$/
};
export const messages = {
	passwordRegex:
		'Password can only contain english letters, numbers, and !@#$%^&*?-_',
	loginRegex:
		'Login can only contain english letters, numbers, hyphens, and underscores',
	min: (word: string, number: number) =>
		`${word} must contain at least ${number} character(s)`,
	max: (word: string, number: number) =>
		`${word} must contain at most ${number} character(s)`,
	required: (word: string) => `${word} is required`
};
export const CAT_API_KEY = import.meta.env.VITE_CAT_API_KEY;
export const CAT_API_URL = import.meta.env.VITE_CAT_API_URL;
export const APP_API_URL = import.meta.env.VITE_APP_API_URL;

if (!CAT_API_KEY) {
	console.warn('Cat API key not found in environment variables');
}
if (!CAT_API_URL) {
	console.warn('Cat API url not found in environment variables');
}
if (!APP_API_URL) {
	console.warn('App API url not found in environment variables');
}
