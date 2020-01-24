'use strict'
const Role = use('App/Models/Role')
const Permission = use('App/Models/Permission')
const Translate = use('App/Helpers/Translate')
const Required = use('App/Helpers/Required')
const Helpers = use('App/Helpers')

class RolePermissionController
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

		let permissionsInObjects = await role.permissions().select('slug').fetch()
		let permissions = Helpers.toArrayLucid(permissionsInObjects, 'slug')

		return response.status(200).json({
			role,
			permissions
		})
	}

	async storeOrUpdate({params, response, request})
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

		let {permissions} = request.all()

		let message = {
			text: Translate.crud('edited_successfully')
		}

		if(permissions.length > 0)
		{

			let permissionCompare = await Permission.query().whereIn('slug', permissions).select('id', 'slug').fetch()
			let permissionsId = Helpers.toArrayLucid(permissionCompare, 'id')
			if(permissionsId.length > 0)
			{
				await role.permissions().detach()

				role.permissions().attach(permissionsId)

				let permissionsOnlySlug = Helpers.toArrayLucid(permissionCompare, 'slug')
				return response.status(200).json({
					role,
					permissions: permissionsOnlySlug,
					message
				})
			}
		}

		let permissionsInObjects = await role.permissions().select('slug').fetch()
		let permissionsOnlySlug = Helpers.toArrayLucid(permissionsInObjects, 'slug')

		return response.status(200).json({
			role,
			permissions: permissionsOnlySlug,
			message
		})
	}
}

module.exports = RolePermissionController
