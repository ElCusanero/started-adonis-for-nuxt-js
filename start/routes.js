'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return {
greeting: 'Hello world in JSON', version: 1.0, routes: Route.list() }
})

/*
LOGIN
 */
Route.post('/auth/users', 'AuthController.loginUsers')
/*MY PROFILE*/
Route.post('auth/users/me', 'AuthController.showUser').middleware('auth')
/*FOR USER AUTH*/Route.group(() => {
	Route.post('/users/change-avatar', 'AuthController.changeAvatar')
	Route.put('/users/change-password', 'AuthController.changePassword')
})
.prefix('/:lang/auth')
.middleware('auth')

/*
USERS
 */
Route.group(() => {
	Route.get('/', 'UserController.index')
		 .middleware('can: users_index or roles_users')

	Route.post('/', 'UserController.store')
		 .middleware('can: users_create')

	Route.get('/:id', 'UserController.show')
		 .middleware('can: users_show')

	Route.put('/:id', 'UserController.update')
		 .middleware('can: users_edit')
	/*Route.delete('/:id', 'UserController.delete')*/
	Route.put('/:id/reset-password', 'UserController.resetPassword')
		 .middleware('can: users_edit')

	Route.put('/:id/status', 'UserController.status')
		 .middleware('can: users_edit')

	Route.put('/:id/property', 'UserController.property')

	Route.get('/:id/roles', 'UserRoleController.index')
		 .middleware('can: users_roles')

	Route.post('/:id/roles', 'UserRoleController.storeOrUpdate')
		 .middleware('can: users_roles')

}).prefix('/:lang/users')
.middleware(['auth', 'lang'])

/*
ROLES
 */
Route.group(() => {
	Route.get('/', 'RoleController.index')
		 .middleware(['can: roles_index or users_roles'])

	Route.post('/', 'RoleController.store')
		 .middleware('can: roles_create')

	Route.get('/:id', 'RoleController.show')
		 .middleware('can: roles_show')

	Route.put('/:id', 'RoleController.update')
		 .middleware('can: roles_edit')

	Route.delete('/:id', 'RoleController.destroy')
 		 .middleware('can: roles_delete')

	Route.get('/:id/permissions', 'RolePermissionController.index')
		 .middleware('can: roles_permissions')

	Route.post('/:id/permissions', 'RolePermissionController.storeOrUpdate')
		 .middleware('can: roles_permissions')

	Route.get('/:id/users', 'RoleUserController.index')
		 .middleware('can: roles_users')

	Route.post('/:id/users', 'RoleUserController.storeOrUpdate')
		 .middleware('can: roles_users')

})
.prefix('/:lang/roles')
.middleware(['auth', 'lang'])

/*
CONFIG
 */
Route.group(() => {
	Route.get('/', 'ConfigController.show')
		 .middleware('can: app_configs')

	Route.put('/', 'ConfigController.update')
 		 .middleware('can: app_configs_edit')

	Route.put('/property', 'ConfigController.property')
	 	 .middleware('can: app_configs_edit')

 	Route.post('/change-avatar', 'ConfigController.changeAvatar')
	 	 .middleware('can: app_configs_edit')

})
.prefix('/:lang/configs')
.middleware(['auth', 'lang'])
