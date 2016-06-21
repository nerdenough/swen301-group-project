function routes($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/dashboard');

  $stateProvider
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'templates/dashboard.html'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'AuthController',
      controllerAs: 'auth'
    })
    .state('routes', {
      url: '/routes',
      templateUrl: 'templates/routes.html',
      controller: 'RoutesController',
      controllerAs: 'routes'
    })
    .state('cities', {
      url: '/cities',
      templateUrl: 'templates/cities.html',
      controller: 'CitiesController',
      controllerAs: 'cities'
    })
    .state('customers', {
      url: '/customers',
      templateUrl: 'templates/customers.html',
      controller: 'CustomerController',
      controllerAs: 'customers'
    })
    .state('analytics', {
      url: '/analytics',
      templateUrl: 'templates/analytics.html',
      controller: 'AnalyticsController',
      controllerAs: 'analytics'
    });
}
