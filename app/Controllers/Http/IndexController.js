'use strict'

const Env = use('Env')

class IndexController
{
    async index({auth, request, response})
    {
		return response.status(200).json({
			app:
			{
				name: Env.get('APP_NAME'),
				version: Env.get('APP_VERSION'),
				description: Env.get('APP_DESCRIPTION')
			},
			company:
			{
				name: Env.get('COMPANY_NAME'),
				slogan: Env.get('COMPANY_SLOGAN')
			}
		})
    }
}

module.exports = IndexController
