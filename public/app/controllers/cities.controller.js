function CitiesController($scope, $http, $cookies) {
  var vm = this;
  vm.cities = [];
  vm.newCity = {};
  vm.error = false;

  vm.alertForm = function() {
    vm.error = true;
  };

  vm.loadCities = function(response) {
    vm.cities = response.data;
  };

  vm.create = function() {
    vm.error = false;

    $http
      .post('/city/create', vm.newCity)
      .then(vm.reload);
  };

  vm.reload = function() {
    $http
      .get('/city/list')
      .then(vm.loadCities);
  };

  vm.reload();
}
