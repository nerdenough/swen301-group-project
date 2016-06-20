angular
  .module('kpsmart', ['ngCookies', 'ui.router'])
  .config(routes)
  .controller('AuthController', AuthController)
  .controller('RoutesController', RoutesController);


