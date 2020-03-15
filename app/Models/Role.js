'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Helpers = use('App/Helpers/App')

class Role extends Model {

	static boot() {
		super.boot()

		/*this.addTrait('@provider:Lucid/Slugify', {
			fields: {
				slug: 'name'
			},
			strategy: 'dbIncrement'
		})*/

		this.addHook('beforeSave', async (roleInstance) => {
			if (roleInstance.dirty.name) {
				roleInstance.slug = Helpers.slug(roleInstance.name)
			}
		})
	}
	permissions()
	{
		return this.belongsToMany('App/Models/Permission')
	}
	users()
	{
		return this.belongsToMany('App/Models/User')
	}
}

module.exports = Role
