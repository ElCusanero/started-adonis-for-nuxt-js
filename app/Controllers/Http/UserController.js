'use strict'
const User = use('App/Models/User')
const Role = use('App/Models/Role')
const Helpers = use('App/Helpers')
const Required = use('App/Helpers/Required')
const Translate = use('App/Helpers/Translate')

class UserController
{
	async index({params, response, request})
	{
		let supported_keys = ['name', 'fname', 'lname','card_id', 'phone', 'email']
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
			/*Create a nicer sql*/
			if(query_key == 'name')
			{
				query_key = 'CONCAT(fname, " ", lname)'
			}
			query_key += ' like ?'
			let users = User.query()
							.whereRaw(query_key, '%'+query_value+'%')

			if(per_page <= 0)
			{
				per_page = await users.getCount()
			}

			users = await users.paginate(page, per_page)

		  	return response.status(200).json({
				users
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
		let user = await User.find(params.id)
		if (JSON.stringify(user) == 'null') {
			let message = {
				text: Translate.crud('user_is_missing')
			}
			return response.status(404).json({
				message
			})
		}
	 	let rolesGet = await user.getRoles()
	 	let permissionsGet = await user.getPermissions()
		user = Object.assign(user, {rols: rolesGet, access: permissionsGet})
		return response.status(200).json({
			user
		})
	}

	async store({request, auth, response})
	{

		const userInfo = request.only([
			'card_id', 'gender', 'status','birth_day',
			'fname', 'lname', 'phone', 'email', 'deleted', 'theme_mode'
		])
		const required = Required.validateString(userInfo, ['card_id', 'gender', 'fname', 'lname', 'email'])
		if (JSON.stringify(required) != '{}')
		{
			return response.status(400).json({
				required
			})
		}

		let emailExist = await User.query().where('email', userInfo.email).first()
		if(JSON.stringify(emailExist) != 'null')
		{
			let required = {
				email: Translate.crud('email_already_use')
			}
			return response.status(400).json({
				required
			})
		}
		const user = new User()
		user.fill(userInfo)
		user.merge({password: Helpers.password()})
		await user.save()
		const userLogged = await auth.generate(user)
		const message = {
			text: Translate.crud('saved_successfully')
		}
		return response.status(200).json({
			credentials: userLogged,
			message
		})
	}

	async update({params, request, response})
	{
		const userInfo = request.only([
			'card_id', 'gender', 'status','birth_day',
			'fname', 'lname', 'phone', 'email', 'deleted', 'theme_mode'
		])
		const required = Required.validateString(userInfo, ['card_id', 'gender', 'fname', 'lname', 'email'])

		if (JSON.stringify(required) != '{}') {
			return response.status(400).json({
				required
			})
		}

		let emailExist = await User.query().where('email', userInfo.email)
								   .andWhere('id', '!=', params.id).first()
		if(JSON.stringify(emailExist) != 'null')
		{
			let required = {
				email: Translate.crud('email_already_use')
			}
			return response.status(400).json({
				required
			})
		}

		let user = await User.find(params.id)
		if (JSON.stringify(user) == 'null') {
			let message = {
				text: Translate.crud('user_is_missing')
			}
			return response.status(404).json({
				message
			})
		}
		user.merge(userInfo)
		await user.save()
		const message = {
			text: Translate.crud('edited_successfully')
		}

		let rolesGet = await user.getRoles()
		let permissionsGet = await user.getPermissions()
		user = Object.assign(user, {rols: rolesGet, access: permissionsGet})

		return response.status(200).json({
			user,
			message
		})
	}

	async property({params, request, response})
	{
		const userInfo = request.only([
			'card_id', 'gender', 'status','birth_day',
			'fname', 'lname', 'phone', 'email', 'deleted', 'lang_key', 'theme_mode'
		])

		let user = await User.find(params.id)
		if (JSON.stringify(user) == 'null') {
			let message = {
				text: Translate.crud('user_is_missing')
			}
			return response.status(404).json({
				message
			})
		}

		user.merge(userInfo)
		await user.save()
		const message = {
			text: Translate.crud('edited_successfully')
		}

		let rolesGet = await user.getRoles()
		let permissionsGet = await user.getPermissions()
		user = Object.assign(user, {rols: rolesGet, access: permissionsGet})

		return response.status(200).json({
			user,
			message
		})
	}

	async resetPassword({params, response})
	{
		const user = await User.find(params.id)
		if (JSON.stringify(user) == 'null') {
			let message = {
				text: Translate.crud('user_is_missing')
			}
			return response.status(404).json({
				message
			})
		}
		let password = Helpers.password()
		user.password = password
		await user.save()
		return response.status(200).json({
			user
		})
	}

	async status({params, response})
	{
		const user = await User.find(params.id)
		if (JSON.stringify(user) == 'null') {
			let message = {
				text: Translate.crud('user_is_missing')
			}
			return response.status(404).json({
				message
			})
		}
		user.status = user.status == 'active' ? 'desactive' : 'active'
		let statusMessage = user.status == 'active' ? 'has_been_activated' : 'has_been_desactivated'
		let message = {
			text: Translate.status(statusMessage, params.lang)
		}

		await user.save()
		return response.status(200).json({
			user,
			message
		})
	}
}

module.exports = UserController
