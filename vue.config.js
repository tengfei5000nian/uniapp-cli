const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')

module.exports = {
	configureWebpack: config => {
		return {
			plugins: [
				new webpack.NormalModuleReplacementPlugin(
					/^ws$/,
					'uniapp-ws'
				)
			]
		}
	}
}