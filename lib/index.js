'use strict'

const debug = require('debug')('loopback:component:user-manager');
const AccessUtils = require('./utils');

module.exports = async function loopbackComponentUserManager(app, options) {
  debug('initializing component');
  const { loopback } = app;
  const loopbackMajor = (loopback && loopback.version && loopback.version.split('.')[0]) || 1;

  if (loopbackMajor < 2) {
    throw new Error('loopback-component-user-manager requires loopback 2.0 or newer');
  }
  let version = app.loopback.version;
  console.log('LoopBack v%s', version);
  //console.log(' components option: %s', options);

  // Initialise helper class.
  app.accessUtils = new AccessUtils(app, options);

  // Set up role resolvers.
  await app.accessUtils.setupRoleResolvers();
};
