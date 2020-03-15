'use strict'

const { Command } = require('@adonisjs/ace')
const User = use('App/Models/User')
const ConfigModel = use('App/Models/Config')
const Role = use('App/Models/Role')
const Permission = use('App/Models/Permission')
const Helpers = use('App/Helpers/App')
const Env = use('Env')

class Config extends Command
{
	static get signature ()
	{
    	return 'config'
  	}

  	static get description ()
	{
    	return 'Create initial configation'
  	}

  	async handle (args, options)
	{

		const roleAdmin = new Role()
		roleAdmin.name = 'Admin'
		roleAdmin.slug = 'admin'
		roleAdmin.description = 'manage administration privileges'
		await roleAdmin.save()

		const permissions = await Permission.createMany(Helpers.permissions())

		let permissionsIds = await Permission.query().pluck('id')
		await roleAdmin.permissions(permissionsIds).attach(permissionsIds)

		let user = await User.create({
			card_id: Env.get('USER_CARD_ID'),
			gender: 'male',
			fname: Env.get('USER_FNAME'),
			lname: Env.get('USER_LNAME'),
			email: Env.get('USER_EMAIL'),
			password: Helpers.password(),
			phone: Env.get('USER_PHONE')
		})

		user.roles().attach([roleAdmin.id])

		const config = new ConfigModel()
		config.name = Env.get('COMPANY_NAME')
		config.slogan = Env.get('COMPANY_SLOGAN')
		config.phone = Env.get('COMPANY_PHONE')
		await config.save()

		const head = []
		const body = Helpers.permissions()
		this.table(head, body)
		this.completed('Permission', 'created successfly')
		return false
  	}
}

module.exports = Config
