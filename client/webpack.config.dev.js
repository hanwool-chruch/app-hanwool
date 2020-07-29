const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require('./webpack.config.common');

module.exports = {
	...commonConfig,
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
				use: ['css-loader'],
			},
			{
				test: /\.s[ac]ss$/,
				use: ['css-loader', 'sass-loader'],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, './public/index.html'),
			filename: path.resolve(__dirname, './dist/index.html'),
			inject: true, // inject built script in the end of body tag
			alwaysWriteToDisk: true,
		}),
	],
};
