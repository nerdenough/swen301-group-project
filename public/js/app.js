var app = angular.module('kpsmart', ['ui.router']);

// Routes
app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/login');

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html'
    })
    .state('analytics', {
      url: '/analytics',
      templateUrl: 'templates/analytics.html'
    });
});
