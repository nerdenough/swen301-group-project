function DeliveryController($scope, $http, $cookies) {
  var vm = this;
  vm.deliveries = [];
  vm.routes = [];
  vm.customers = [];
  vm.companies = [];
  vm.cities = [];
  vm.newDelivery = {};
  vm.error = false;

  vm.alertForm = function() {
    vm.error = true;
  };

  vm.loadCustomers = function(response) {
    vm.customers = response.data;
  };

  vm.loadCompanies = function(response) {
    vm.companies = response.data;
  };

  vm.loadCities = function(response) {
    vm.cities = response.data;
  };

  vm.loadRoutes = function(response) {
    for (var i = 0; i < response.data.length; i++) {
      var route = {
        id: response.data[i].id,
        cost: response.data[i].cost,
        price: response.data[i].price,
        maxWeight: response.data[i]['max_weight'],
        maxVolume: response.data[i]['max_volume'],
        type: response.data[i]['route_type'],
        active: response.data[i].active
      };

      for (var j = 0; j < vm.cities.length; j++) {
        if (response.data[i].origin === vm.cities[j].id) {
          route.origin = vm.cities[j].name;
        }

        if (response.data[i].destination === vm.cities[j].id) {
          route.destination = vm.cities[j].name;
        }
      }

      for (var k = 0; k < vm.companies.length; k++) {
        if (response.data[i].company === vm.companies[k].id) {
          route.company = vm.companies[k].name;
        }
      }

      vm.routes.push(route);
    }
  };

  vm.loadDeliveries = function(response) {
    for (var i = 0; i < response.data.length; i++) {
      var delivery = {
        id: response.data[i].id,
        cost: response.data[i].cost,
        price: response.data[i].price,
        weight: response.data[i].weight,
        volume: response.data[i].volume,
      };

      for (var j = 0; j < vm.customers.length; j++) {
        if (response.data[i].sender === vm.customers[j].id) {
          delivery.sender = vm.customers[j].firstname + ' ' + vm.customers[j].lastname;
        }

        if (response.data[i].recipient === vm.customers[j].id) {
          delivery.recipient = vm.customers[j].firstname + ' ' + vm.customers[j].lastname;
        }
      }

      for (var k = 0; k < vm.cities.length; k++) {
        if (response.data[i].origin === vm.cities[k].id) {
          delivery.origin = vm.cities[k].name;
        }

        if (response.data[i].destination === vm.cities[k].id) {
          delivery.destination = vm.cities[k].name;
        }
      }

      for (var l = 0; l < vm.routes.length; l++) {
        if (response.data[i].route === vm.routes[l].id) {
          delivery.route = vm.routes[l].name;
        }
      }

      vm.deliveries.push(delivery);
    }
  };

  vm.create = function() {
    vm.error = false;

    $http
      .post('/delivery/create', vm.newDelivery)
      .then(vm.reload);
  };

  vm.reload = function() {
    $http
      .get('/city/list')
      .then(vm.loadCities);

    $http
      .get('/customer/list')
      .then(vm.loadCustomers);

    $http
      .get('/company/list')
      .then(vm.loadCompanies);

    $http
      .get('/route/list')
      .then(vm.loadRoutes);

    $http
      .get('/delivery/list')
      .then(vm.loadDeliveries);
  };

  vm.reload();
}
