const commonConfig = require('./webpack.config.common');
const path = require('path');

module.exports = {
	...commonConfig,
	devServer: {
		contentBase: path.resolve(__dirname, '../server/public'),
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
	devtool: 'source-map',
	mode: 'development',
};
