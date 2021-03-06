'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {
	static boot() {
		super.boot()

		/**
		 * A hook to hash the user password before saving
		 * it to the database.
		 */
		/*this.addHook('beforeSave', async (userInstance) => {
			if (userInstance.dirty.password) {
				userInstance.password = await Hash.make(userInstance.password)
			}
		})*/

	}

	roles() {
		return this.belongsToMany('App/Models/Role')
	}


	/**
	 * A relationship on tokens is required for auth to
	 * work. Since features like `refreshTokens` or
	 * `rememberToken` will be saved inside the
	 * tokens table.
	 *
	 * @method tokens
	 *
	 * @return {Object}
	 */
	tokens() {
		return this.hasMany('App/Models/Token')
	}


	static get traits() {
		return [
			'@provider:Adonis/Acl/HasRole',
			'@provider:Adonis/Acl/HasPermission'
		]
	}

	static get hidden() {
		return ['password']
	}

	static get dates() {
		return super.dates.concat(['birth_day'])
	}

	getBirthDay(birth_day)
	{
		return birth_day.format('YYYY-MM-DD')
	}
}

module.exports = User
