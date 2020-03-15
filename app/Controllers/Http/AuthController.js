'use strict'

const Required = use('App/Helpers/Required')
const Translate = use('App/Helpers/Translate')
const HelperConfig = use('App/Helpers/App')
const User = use('App/Models/User')
const Hash = use('Hash')

class AuthController {
    async loginUsers({params, auth, request, response})
    {
		const userLogin = request.only(['email', 'password'])
		const required = Required.validateString(userLogin, ['email', 'password'])
		if(JSON.stringify(required) != '{}')
		{
			return response.status(400).json({required})
		}

		let user = await User.query().where('email', userLogin.email)
									.first()

		if(JSON.stringify(user) == 'null')
		{
			let message = {
				text: Translate.crud('bad_credentials')
			}
			return response.status(401).json({message})
		}

		let passwordCompare = await Hash.verify(userLogin.password, user.password)
		if(!passwordCompare)
		{
			let message = {
				text: Translate.crud('bad_credentials')
			}
			return response.status(401).json({message})
		}

		if(user.status === 'desactive')
		{
			let message = {
				text: Translate.status('account_disabled')
			}
			return response.status(401).json({
				message
			})
		}

		const userLogged = await auth.generate(user)
		return response.status(200).json({
			credentials: userLogged
		})
    }

    async showUser({auth, request, response})
    {
        let user = await auth.getUser()
	 	let rolesGet = await user.getRoles()
	 	let permissionsGet = await user.getPermissions()
		user = Object.assign(user, {rols: rolesGet, access: permissionsGet})
		return response.status(200).json({user})
    }

	async changeAvatar({params, auth, request, response})
	{
		let user = await auth.getUser()

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

		let filename = user.id+'.'+photo.subtype

		await photo.move(`./public/app/users`, {
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
		user.src = 'app/users/'+filename
		await user.save()
		const message = {
			text: Translate.crud('avatar_successfully', params.lang)
		}
		let rolesGet = await user.getRoles()
		let permissionsGet = await user.getPermissions()
		user = Object.assign(user, {rols: rolesGet, access: permissionsGet})

		return response.status(200).json({user, message})
	}

	async changePassword({params, auth, request, response})
	{
		let user = await auth.getUser()

		const userInfo = request.only(['password_old', 'password_new', 'password_confirm'])
		const required = Required.validateString(userInfo, ['password_old', 'password_new', 'password_confirm'], params.lang)

		if(JSON.stringify(required) != '{}')
		{
			return response.status(400).json({required})
		}

		let isCorrect = await Hash.verify(userInfo.password_old, user.password)
		if(!isCorrect)
		{
			let required =
			{
				password_old: Translate.crud('current_password_not_match', params.lang)
			}
			return response.status(400).json({required})
		}

		if(userInfo.password_new != userInfo.password_confirm)
		{
			let required =
			{
				password_new: Translate.crud('new_password_not_match', params.lang),
				password_confirm: Translate.crud('new_password_not_match', params.lang)
			}
			return response.status(400).json({required})
		}

		let password = userInfo.password_confirm
		user.password = await Hash.make(password)
		await user.save()
		let message = {
			text: Translate.crud('password_successfully', params.lang)
		}

		let rolesGet = await user.getRoles()
		let permissionsGet = await user.getPermissions()
		user = Object.assign(user, {rols: rolesGet, access: permissionsGet})

		return response.status(200).json({
			user,
			message
		})
	}
}

module.exports = AuthController
