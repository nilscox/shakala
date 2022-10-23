/* eslint-disable */
const path = require('path');
const moduleAlias = require('module-alias');

moduleAlias.addAliases({
  shared: path.resolve(__dirname, '..', '0-shared/dist'),
  'backend-domain': path.resolve(__dirname, '..', '1-backend-domain/dist'),
  'backend-application': path.resolve(__dirname, '..', '2-backend-application/dist'),
});
