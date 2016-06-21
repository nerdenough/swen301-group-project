angular
  .module('kpsmart', ['ngCookies', 'ui.router'])
  .config(routes)
  .controller('AuthController', AuthController)
  .controller('RoutesController', RoutesController)
  .controller('CitiesController', CitiesController)
  .controller('CustomerController', CustomerController)
  .controller('CompanyController', CompanyController)
  .controller('AnalyticsController', AnalyticsController);


