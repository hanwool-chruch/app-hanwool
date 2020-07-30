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
	module: {
		rules: [
			{
				test: /\.ts$/,
				include: [path.resolve(__dirname, 'src')],
				exclude: /node_modules/,
				loader: 'ts-loader',
			},
			{
				test: /\.js$/,
				use: 'babel-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.s[ac]ss$/,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, './public/index.html'),
			filename: path.resolve(__dirname, '../server/public/index.html'),
			inject: true, // inject built script in the end of body tag
			alwaysWriteToDisk: true,
		}),
	]
};
