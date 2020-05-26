'use strict'
const Role = use('App/Models/Role')
const Translate = use('App/Helpers/Translate')
const Required = use('App/Helpers/Required')
const Helpers = use('App/Helpers/App')

class RoleController
{
	async index({params, response, request})
	{
		let supported_keys = ['slug', 'name', 'description']
		let required = {}
		required = Required.validateString(request.all(), ['query_key'], params.lang)
		if (JSON.stringify(required) != '{}')
		{
			return response.status(400).json({
				required,
				supported_keys
			})
		}

		required = Required.validateExist(request.all(), ['query_value'], params.lang)
		if (JSON.stringify(required) != '{}')
		{
			return response.status(400).json({
				required
			})
		}

		let {page, per_page, query_key, query_value} = request.all()

		if(supported_keys.includes(query_key))
		{

			let roles = Role.query()
							  .where(query_key, 'like', '%'+query_value+'%')
			if(per_page <= 0)
  			{
  				per_page = await roles.getCount()
  			}

  			roles = await roles.paginate(page, per_page)

		  	return response.status(200).json({
				roles
			})

		}
		else
		{
			let required = {
				query_key: Translate.rules('field_does_not_exist', params.lang)
			}
			return response.status(400).json({
				required,
				supported_keys
			})
		}
	}

	async show({params, response})
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
		let permissions = Helpers.toArrayLucid(permissionsInObjects, 'slug');

		return response.status(200).json({
			role,
			permissions
		})
	}

	async store({params, request, response})
	{

		const roleInfo = request.only(['name', 'description'])
		const required = Required.validateString(roleInfo, ['name', 'description'], params.lang)

		if (JSON.stringify(required) != '{}')
		{
			return response.status(400).json({
				required
			})
		}

		let nameExist = await Role.findBy('name', roleInfo.name)
		if(JSON.stringify(nameExist) != 'null')
		{
			let required = {
				name: Translate.crud('name_already_use', params.lang)
			}
			return response.status(400).json({
				required
			})
		}

		const role = new Role()
		role.merge(roleInfo)
		await role.save()
		await role.permissions().attach(1)
		const message = {
			text: Translate.crud('saved_successfully', params.lang)
		}
		return response.status(200).json({
			role,
			message
		})
	}

	async update({params, request, response})
	{
		const roleInfo = request.only(['name', 'description'])
		const required = Required.validateString(roleInfo, ['name', 'description'], params.lang)

		if (JSON.stringify(required) != '{}')
		{
			return response.status(400).json({
				required
			})
		}

		let nameExist = await Role.query().where('name', roleInfo.name)
								   .andWhere('id', '!=', params.id).first()

		if(JSON.stringify(nameExist) != 'null')
		{
			let required = {
				name: Translate.crud('name_already_use', params.lang)
			}
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

		role.merge(roleInfo)
		await role.save()

		const message = {
			text: Translate.crud('edited_successfully', params.lang)
		}

		return response.status(200).json({
			role,
			message
		})
	}

	async destroy({params,response})
	{
		const role = await Role.find(params.id)
		if (JSON.stringify(role) == 'null') {
			let message = {
				text: Translate.crud('role_is_missing', params.lang)
			}
			return response.status(404).json({
				message
			})
		}
		let countPermissions = await role.permissions().getCount()
		if(countPermissions > 0)
		{
			let message = {
				text: Translate.crud('cannot_removed_being_used', params.lang)
			}
			return response.status(400).json({
				message
			})
		}

		await role.delete()
		let message = {
			text: Translate.crud('removed_successfully', params.lang)
		}
		return response.status(200).json({
			role,
			message
		})
	}
}

module.exports = RoleController
