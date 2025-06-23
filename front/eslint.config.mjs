import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';

export default [
	{
		ignores: ['dist', 'eslint.config.mjs']
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.es2020
			},
			parser: tseslint.parser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module'
			}
		},
		plugins: {
			'react-hooks': pluginReactHooks,
			'react-refresh': pluginReactRefresh
		},
		rules: {
			...pluginJs.configs.recommended.rules,
			...tseslint.configs.recommended.rules,
			'react-refresh/only-export-components': [
				'warn',
				{ allowConstantExport: true }
			]
		}
	}
];
