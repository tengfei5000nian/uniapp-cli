export default function(app) {
	app.mixins.push(service => {
		service.hooks({
			after: context => {
				if ((context.result || {}).code === 'number' && context.result.code !== 1) throw context.result || context
			}
		})
	})
}