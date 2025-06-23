import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	{
		languageOptions: {
			parserOptions: {
				project: 'tsconfig.json',
				tsconfigRootDir: import.meta.dirname,
				sourceType: 'module'
			},
			globals: {
				...globals.node,
				...globals.jest
			}
		},
		rules: {
			'@typescript-eslint/interface-name-prefix': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-explicit-any': 'off'
		}
	},
	{
		ignores: ['eslint.config.mjs', 'dist/', 'node_modules/']
	}
);
