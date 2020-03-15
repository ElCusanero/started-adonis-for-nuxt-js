'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ConfigSchema extends Schema
{
	up()
	{
		this.create('configs', (table) =>
		{
			table.increments()
			table.string('web').nullable()
			table.string('logo').nullable()
			table.string('name').nullable()
			table.string('slogan').nullable()
			table.string('email').nullable()
			table.string('contact_message').nullable()
			table.string('phone').nullable()
			table.string('telephone').nullable()
			table.string('address').nullable()
			table.string('city').nullable()
			table.string('state').nullable()
			table.string('country').nullable()
			table.string('postal_code').nullable()
			table.string('terms').nullable()
			table.string('latitude').nullable()
			table.string('longitude').nullable()
			table.string('zoom').nullable()
			table.string('google_map_key').nullable()
			table.timestamps()
		})
	}

	down()
	{
		this.drop('configs')
	}
}

module.exports = ConfigSchema
