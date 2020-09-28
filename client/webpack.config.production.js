const commonConfig = require('./webpack.config.common');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	...commonConfig,
	mode: 'production',
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
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							[
								'@babel/preset-env',
								{
									targets: '> 1%, not dead',
									useBuiltIns: 'usage',
									corejs: '3',
									modules: false,
								},
							],
						],
						plugins: ['transform-remove-console'],
					},
				},
			},
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
			{
				test: /\.s[ac]ss$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin({
			cleanAfterEveryBuildPatterns: ['../server/public/static'],
		}),
		new MiniCssExtractPlugin({
			filename: 'style.css',
		}),
	],
};
