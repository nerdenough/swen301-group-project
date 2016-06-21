function CustomerController($scope, $http, $cookies) {
  var vm = this;
  vm.customers = [];
  vm.newCustomers = {};
  vm.error = false;

  vm.alertForm = function() {
    vm.error = true;
  };

  vm.loadCustomers = function(response) {
    vm.customers = response.data;
  };

  vm.create = function() {
    vm.error = false;

    $http
      .post('/customer/create', vm.newCustomer)
      .then(vm.reload);
  };

  vm.reload = function() {
    $http
      .get('/customer/list')
      .then(vm.loadCustomers);
  };

  vm.reload();
}
