const path = require('path');

module.exports = {
	entry: './src/index.ts',
	output: {
		path: path.resolve(__dirname, 'dist/static'),
		filename: 'bundle.js',
	},
	resolve: {
		extensions: ['.ts', '.js', '.json'],
	},
	devServer: {
		contentBase: path.join(__dirname, './dist'),
		publicPath: '/static/',
		compress: true,
		port: 5500,
		hot: true,
		proxy: {
			'/api': {
				target: {
					host: 'localhost',
					// protocol: config.dev.proxyProtocol, // 백엔드 프로토콜 'http'
					port: 3000,
				},
			},
		},
	},
	mode: 'development',
};
