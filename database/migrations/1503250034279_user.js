'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Helpers = use('App/Helpers')
class UserSchema extends Schema {
	up() {
		this.create('users', (table) => {
			table.increments()
            table.string('card_id').notNullable()
            table.enu('gender', ['male', 'female', 'other']).notNullable()
            table.string('fname').notNullable()
            table.string('lname').notNullable()
            table.string('phone')
            table.string('email', 254).notNullable().unique()
            table.string('password', 254).notNullable() //secret
            table.string('src').defaultTo('app/users/profile.svg')
			table.date('birth_day')
            table.boolean('deleted').defaultTo(0).comment('1: Yes, 0: No')
            table.enu('status', ['active', 'desactive']).defaultTo('active').comment('Status the user for access of the system.')
			table.string('lang_key').defaultTo('es_GT')
			table.string('theme_mode').defaultTo('white')
            table.timestamps()
		})
	}

	down() {
		this.drop('users')
	}
}

module.exports = UserSchema
