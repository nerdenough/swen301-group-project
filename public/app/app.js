angular
  .module('kpsmart', ['ngCookies', 'ui.router'])
  .config(routes)
  .controller('DashboardController', DashboardController)
  .controller('AuthController', AuthController)
  .controller('RoutesController', RoutesController)
  .controller('CitiesController', CitiesController)
  .controller('CustomerController', CustomerController)
  .controller('CompanyController', CompanyController)
  .controller('DeliveryController', DeliveryController)
  .controller('AnalyticsController', AnalyticsController);
