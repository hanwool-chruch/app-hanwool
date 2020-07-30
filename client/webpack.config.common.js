const path = require('path');

module.exports = {
	entry: './src/index.ts',
	output: {
		path: path.resolve(__dirname, '../server/public/static'),
		filename: 'bundle.js',
	},
	resolve: {
		extensions: ['.ts', '.js', '.json'],
	},
};
