'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

Factory.blueprint('App/Models/Role', (faker) => {
	return {
		slug: 'administrator',
		name: 'Administrador',
		description: 'User administrator of the system.'
	}
})

Factory.blueprint('App/Models/Permission', (faker) => {
	return {
		slug: 'create-user',
		name: 'Crear usuario',
		description: 'Create user of the system.'
	}
})
