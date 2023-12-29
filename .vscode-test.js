// .vscode-test.js
const { defineConfig } = require('@vscode/test-cli');

//module.exports = defineConfig({ files: 'out/test/**/*.test.js' });

module.exports = defineConfig([
	{
		label: 'allTest',
		files: 'out/test/**/*.test.js',
		version: 'stable',
		workspaceFolder: './test/resources/projects/advpl',
		mocha: {
			ui: 'tdd',
			timeout: 20000
		}
	},
]);