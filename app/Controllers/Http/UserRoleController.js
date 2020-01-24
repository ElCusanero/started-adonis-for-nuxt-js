'use strict'
const User = use('App/Models/User')
const Role = use('App/Models/Role')
const Helpers = use('App/Helpers')
const Required = use('App/Helpers/Required')
const Translate = use('App/Helpers/Translate')

class UserRoleController
{
	async index({params, response})
	{
		let user = await User.find(params.id)
		if (JSON.stringify(user) == 'null')
		{
			let message = {
				text: Translate.crud('user_is_missing', params.lang)
			}
			return response.status(404).json({
				message
			})
		}
		let roles = await user.roles().fetch()
		return response.status(200).json({
			user,
			roles
		})
	}
	async storeOrUpdate({params, response, request})
	{
		let required = Required.validateArray(request.all(), ['roles'], params.lang)
		if (JSON.stringify(required) != '{}')
		{
			return response.status(400).json({
				required
			})
		}

		let user = await User.find(params.id)
		if (JSON.stringify(user) == 'null')
		{
			let message = {
				text: Translate.crud('user_is_missing', params.lang)
			}
			return response.status(404).json({
				message
			})
		}

		let message = {
			text: Translate.crud('assigned_charges')
		}

		let {roles} = request.all()

		let rolesQueryInObjects = await Role.query().whereIn('id',roles).fetch()
		let rolesIds = Helpers.toArrayLucid(rolesQueryInObjects, 'id')
		if(rolesIds.length > 0)
		{
			await user.roles().detach()
			user.roles().attach(rolesIds)
			return response.status(200).json({
				user,
				roles: rolesQueryInObjects,
				message
			})
		}

		let rolesInObjects = await user.roles().fetch()
		return response.status(200).json({
			user,
			roles: rolesInObjects,
			message
		})
	}
}

module.exports = UserRoleController
