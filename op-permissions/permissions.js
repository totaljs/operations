// Author: Peter Širka / Total Avengers
// Web: https://www.totaljs.com
// License: MIT

// Usage in routes:
// ROUTE('+GET     /api/permissions/find/    *     --> @cl_users_find');
// ROUTE('+GET     /api/permissions/read/    *     --> @cl_users_read');

// This operation loads all users, groups and roles
NEWOPERATION('cl_users_find', function($) {

	var builder = DBMS().find('tbl_user');
	var query = ($.query.q || '').toSearch();

	builder.fields('id,name');
	builder.where('openplatformid', $.user.openplatformid);
	builder.query('isremoved=FALSE');
	builder.limit(15);

	query && builder.search('search', query);

	builder.callback(function(err, response) {

		var meta = $.user.cl();
		if (meta) {

			// Groups
			for (let i = 0; i < meta.groups.length; i++) {
				let item = meta.groups[i];
				if (item.name.toSearch().indexOf(query) !== -1) {
					let clone = {};
					clone.name = item.name;
					clone.id = '#' + item.id;
					if (response.push(clone) > 15)
						break;
				}
			}

			// Roles
			for (let i = 0; i < meta.roles.length; i++) {
				let item = meta.roles[i];
				if (item.name.toSearch().indexOf(query) !== -1) {
					let clone = {};
					clone.name = item.name;
					clone.id = '@' + item.id;
					if (response.push(clone) > 15)
						break;
				}
			}
		}

		$.callback(response);
	});
});

// This operation reads all names by id (api/?q=id,id,id)
NEWOPERATION('cl_users_read', function($) {

	var id = ($.query.id || '').split(',');

	if (!id.length) {
		$.callback(EMPTYARRAY);
		return;
	}

	var output = [];
	var meta = $.user.cl();
	var userid = [];
	var tmp;

	for (var i = 0; i < id.length; i++) {
		switch (id[i][0]) {
			case '#':
				var group = meta.groups.findItem('id', id[i].substring(1));
				if (group) {
					tmp = {};
					tmp.id = '#' + group.id;
					tmp.name = group.name;
					output.push(tmp);
				}
				break;
			case '@':
				var role = meta.roles.findItem('id', id[i].substring(1));
				if (role) {
					tmp = {};
					tmp.id = '@' + role.id;
					tmp.name = role.name;
					output.push(tmp);
				}
				break;
			default:
				userid.push(id[i]);
				break;
		}
	}

	if (userid.length) {
		var builder = DBMS().find('tbl_user');
		builder.fields('id,name');
		builder.in('id', userid);
		builder.where('openplatformid', $.user.openplatformid);
		builder.query('isremoved=FALSE');
		builder.limit(100);
		builder.callback(function(err, response) {
			for (var i = 0; i < response.length; i++)
				output.push(response[i]);
			$.callback(output);
		});
	} else
		$.callback(output);
});