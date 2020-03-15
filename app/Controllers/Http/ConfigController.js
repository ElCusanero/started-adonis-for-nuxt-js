'use strict'

const Config = use('App/Models/Config')
const Required = use('App/Helpers/Required')
const Translate = use('App/Helpers/Translate')

class ConfigController
{
	async show({response, request})
	{
		let configs = await Config.first()
		return response.json({configs})
	}

	async update({params, response, request})
	{
		let configsInfo = request.all()
		let required = Required.validateString(configsInfo, ['name', 'slogan', 'address',
															'city', 'state', 'country'], params.lang)
		if (JSON.stringify(required) != '{}')
		{
			return response.status(400).json({
				required
			})
		}
		let configs = await Config.first()
		configs.merge(configsInfo)
		await configs.save()
		const message = {
			text: Translate.crud('edited_successfully', params.lang)
		}
		return response.json({configs, message})
	}

	async changeAvatar({params, response, request})
	{
		let configs = await Config.find(1)

		const photo = request.file('avatar', {
			types: ['image'],
			size: '25mb',
			extnames: ['png', 'gif', 'jpg', 'jpeg']
		})

		if(JSON.stringify(photo) == 'null')
		{
			const message = {
				text: Translate.crud('edited_error', params.lang)
			}
			return response.status(400).json({message})
		}

		let filename = configs.id+'.'+photo.subtype

		await photo.move(`./public/app`, {
			name: filename,
			overwrite: true
		})

		if (!photo.moved()) {
			return response.status(422).send({
				status: false,
				message: photo.error(),
				errors: photo.error()
			})
		}

		configs.logo = 'app/'+filename
		await configs.save()

		const message = {
			text: Translate.crud('logo_successfully', params.lang)
		}

		return response.status(200).json({configs, message})
	}
}

module.exports = ConfigController
