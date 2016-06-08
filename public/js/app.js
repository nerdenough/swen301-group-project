var app = angular.module('kpsmart', ['ui.router']);

// Routes
app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/dashboard');

  $stateProvider
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'templates/dashboard.html'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html'
    })
    .state('analytics', {
      url: '/analytics',
      templateUrl: 'templates/analytics.html'
    });
});
