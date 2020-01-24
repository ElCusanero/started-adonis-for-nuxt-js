'use strict'
const Role = use('App/Models/Role')
const User = use('App/Models/User')
const Required = use('App/Helpers/Required')
const Helpers = use('App/Helpers')
const Translate = use('App/Helpers/Translate')

class RoleUserController
{
	async index({params, response})
	{
		let role = await Role.find(params.id)
		if (JSON.stringify(role) == 'null')
		{
			let message = {
				text: Translate.crud('role_is_missing', params.lang)
			}
			return response.status(404).json({
				message
			})
		}
		let users = await role.users().fetch()
		return response.status(200).json({
			role,
			users
		})
	}
	async storeOrUpdate({params, response, request})
	{
		let required = Required.validateArray(request.all(), ['users'], params.lang)
		if (JSON.stringify(required) != '{}')
		{
			return response.status(400).json({
				required
			})
		}

		let role = await Role.find(params.id)
		if (JSON.stringify(role) == 'null')
		{
			let message = {
				text: Translate.crud('role_is_missing', params.lang)
			}
			return response.status(404).json({
				message
			})
		}

		let message = {
			text: Translate.crud('assigned_users')
		}

		let {users} = request.all()
		if(users instanceof Array)
		{
			let userQueryInObjects = await User.query().whereIn('id',users).fetch()
			let userIds = Helpers.toArrayLucid(userQueryInObjects, 'id')
			if(userIds.length > 0)
			{
				await role.users().detach()
				role.users().attach(userIds)
				return response.status(200).json({
					role,
					users: userQueryInObjects,
					message
				})
			}
		}

		let userInObjects = await role.permissions().fetch()
		return response.status(200).json({
			role,
			users: userInObjects
		})
	}
}

module.exports = RoleUserController
