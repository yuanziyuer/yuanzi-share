var fs = require('fs')
var path = require('path')
var webpack = require('webpack')

module.exports = {

	devtool: 'source-map',

	entry: './modules/client.js',

	output: {
		path: __dirname + '/__build__',
		filename: '[name].js',
		chunkFilename: '[id].chunk.js',
		publicPath: '/__build__/'
	},

	module: {
		loaders: [
			{ test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
			{ test: /\.css$/, loader: "style-loader!css-loader" },
			{
				test: /\.png$/,
				loader: "url-loader",
				query: { mimetype: "image/png" }
			}
		]
	},

	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compressor: { warnings: false },
		}),

		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
			'process.env.BROWSER': JSON.stringify(process.env.NODE_ENV || 'development'),
		})
	]

}
