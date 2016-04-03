// Here are all the API routes.

import user_create from './user/create';
import user_read from './user/read';
import user_update from './user/update';

import auth_login from './auth/login';
import auth_logout from './auth/logout';

export default [
	user_create,
	user_read,
	user_update,
	auth_login,
	auth_logout
];