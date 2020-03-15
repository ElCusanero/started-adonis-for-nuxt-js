const Slug = use('slug')

class Index
{
    static password()
    {
		return '$2a$10$QQyolwH4Zp04gNwck2iaI.w9P1iHVm6pO9OcLoaIq0.uEN8vJHSQy'
    }

	static slug(word, simbol = '-')
	{
		return Slug(word, {lower: true, replacement: simbol})
	}

	static langs()
	{
		return ['en-US', 'es-GT']
	}

	static toArrayLucid(collection = [], column = '')
	{
		let collectionReturn = []
		for(const i in collection.rows)
		{
			const row = collection.rows[i]
			collectionReturn.push(row[column])
		}
		return collectionReturn
	}

	static permissions()
	{
		return [
			{
				slug: 'index',
				name: 'index'
			},
			{
				slug: 'access_index',
				name: 'access_index'
			},
			{
				slug: 'users_index',
				name: 'users_index'
			},
			{
				slug: 'users_create',
				name: 'users_create'
			},
			{
				slug: 'users_show',
				name: 'users_show'
			},
			{
				slug: 'users_edit',
				name: 'users_edit'
			},
			{
				slug: 'roles_index',
				name: 'roles_index'
			},
			{
				slug: 'roles_create',
				name: 'roles_create'
			},
			{
				slug: 'roles_show',
				name: 'roles_show'
			},
			{
				slug: 'roles_edit',
				name: 'roles_edit'
			},
			{
				slug: 'roles_delete',
				name: 'roles_delete'
			},
			{
				slug: 'roles_permissions',
				name: 'roles_permissions'
			},
			{
				slug: 'users_roles',
				name: 'users_roles'
			},
			{
				slug: 'roles_users',
				name: 'roles_users'
			},
			{
				slug: 'app_configs',
				name: 'app_configs'
			},
			{
				slug: 'app_configs_edit',
				name: 'app_configs_edit'
			}
		]
	}
}
module.exports = Index
