function RoutesController($scope, $http, $cookies) {
  var vm = this;
  vm.routes = [];
  vm.companies = [];
  vm.cities = [];

  vm.loadCompanies = function(response) {
    vm.companies = response.data;
  };

  vm.loadCities = function(response) {
    vm.cities = response.data;
  };

  vm.loadRoutes = function(response) {
    for (var i = 0; i < response.data.length; i++) {
      var route = response.data[i];
      route.company = vm.companies[route.company - 1].name;
      route.origin = vm.cities[route.origin - 1].name;
      route.destination = vm.cities[route.destination - 1].name;
    }

    vm.routes = response.data;
  };

  $http
    .get('/city/list')
    .then(vm.loadCities);

  $http
    .get('/company/list')
    .then(vm.loadCompanies);

  $http
    .get('/route/list')
    .then(vm.loadRoutes);
}
