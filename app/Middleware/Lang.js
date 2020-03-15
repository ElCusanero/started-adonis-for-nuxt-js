'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Helpers = use('App/Helpers/App')
const Translate = use('App/Helpers/Translate')

class Lang {
	/**
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Function} next
	 */
	async handle({params,request, response}, next)
	{
		let langExist = Helpers.langs().includes(params.lang)
		if(!langExist)
		{
			return response.status(404).json({
				supported_languages: Helpers.langs()
			})
		}

		await next()
	}
}

module.exports = Lang
