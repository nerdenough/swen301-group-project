function CompanyController($scope, $http, $cookies) {
  var vm = this;
  vm.companies = [];
  vm.cities = [];
  vm.newCompany = {};
  vm.error = false;

  vm.alertForm = function() {
    vm.error = true;
  };

  vm.loadCompanies = function(response) {
    for (var i = 0; i < response.data.length; i++) {
      for (var j = 0; j < vm.cities.length; j++) {
        if (vm.cities[j].id === response.data[i].city) {
          response.data[i].city = vm.cities[j].name;
        }
      }
    }

    vm.companies = response.data;
  };

  vm.loadCities = function(response) {
    vm.cities = response.data;
  };

  vm.create = function() {
    vm.error = false;

    $http
      .post('/company/create', vm.newCompany)
      .then(vm.reload);
  };

  vm.reload = function() {
    $http
      .get('/city/list')
      .then(vm.loadCities);

    $http
      .get('/company/list')
      .then(vm.loadCompanies);
  };

  vm.reload();
}
