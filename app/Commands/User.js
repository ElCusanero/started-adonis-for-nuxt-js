'use strict'

const { Command } = require('@adonisjs/ace')
const UserB = use('App/Models/User')
const Role = use('App/Models/Role')
const Permission = use('App/Models/Permission')
const Helpers = use('App/Helpers')

const Database = use('Database')

class User extends Command {
	static get signature () {
    	return 'user'
  	}

  	static get description () {
    	return 'Create one user'
  	}

  	async handle (args, options) {

		const roleAdmin = new Role()
		roleAdmin.name = 'Admin'
		roleAdmin.slug = 'admin'
		roleAdmin.description = 'manage administration privileges'
		await roleAdmin.save()

		const permissions = await Permission.createMany(Helpers.permissions())

		let permissionsIds = await Permission.query().pluck('id')
		await roleAdmin.permissions(permissionsIds).attach(permissionsIds)

		let user = await UserB.create({
			card_id: '3180',
			gender: 'male',
			fname: 'Elmer',
			lname: 'Cusanero',
			email: 'uno@users.com',
			password: Helpers.password()
		})

		user.roles().attach([roleAdmin.id])

		const head = []
		const body = Helpers.permissions()
		this.table(head, body)
		this.completed('Permission', 'created successfly')
		return false
  	}
}

module.exports = User
