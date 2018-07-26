'use strict'

const debug = require('debug')('loopback:component:access');
const { createPromiseCallback } = require('loopback-datasource-juggler/lib/utils');
const _defaults = require('lodash').defaults;
const _each = require('lodash').each;
const _some = require('lodash').some;

module.exports = class AccessUtils {
  constructor(app, options) {
    this.app = app;

    this.options = _defaults({ }, options, {
      userModel: 'user',
      roleModel: 'role',
      groupModel: 'group'
    });
    // Save the component config for easy reference.
    app.set('loopback-component-user-manager', options);
    debug(options);
  }

  /**
   * Register a dynamic role resolver for each role
   */
  setupRoleResolvers() {
    const Role= this.app.models[this.options.roleModel];
    const User = this.app.models[this.options.userModel];

    Role.find().then(function (roles) {
      _each(roles,function (role) {
        const roleName='$'+role.name;
        debug(`Registering role resolver for ${roleName}`);
        Role.registerResolver(roleName, (role, context, cb) => {
          cb = cb || createPromiseCallback();
          //Q: Is the user logged in? (there will be an accessToken with an ID if so)
          const userId = context.accessToken.userId;
          if (!userId) {
            //A: No, user is NOT logged in: callback with FALSE
            return process.nextTick(() => cb(null, false));
          }
          User.findOne({where: {id: userId},include: {group: 'roles'}}).then(function (user) {
            user=user.toJSON();
            if (user.group && user.group.roles) {
              return cb(null,_some(user.group.roles, ['name',role.slice(1)]));
            }
            return cb(null,false);
          });
        });

      });

    });
  }

};
