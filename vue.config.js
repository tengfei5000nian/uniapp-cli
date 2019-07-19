const webpack = require('webpack')
const merge = require('webpack-merge')

module.exports = {
	configureWebpack: {
		plugins: [
			new webpack.NormalModuleReplacementPlugin(/index\.js/, resource => {
				console.log(resource)
			})
		]
	}
}