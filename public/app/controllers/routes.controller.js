function RoutesController($scope, $http, $cookies) {
  var vm = this;
  vm.routes = [];
  vm.routesRaw = [];
  vm.companies = [];
  vm.cities = [];
  vm.newRoute = {};
  vm.error = false;

  vm.alertForm = function() {
    vm.error = true;
  };

  vm.loadCompanies = function(response) {
    vm.companies = response.data;
  };

  vm.loadCities = function(response) {
    vm.cities = response.data;
  };

  vm.loadRoutes = function(response) {
    for (var i = 0; i < response.data.length; i++) {
      console.log(response.data);
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
        if (response.data[k].company === vm.companies[k].id) {
          route.company = vm.companies[k].name;
        }
      }

      vm.routes.push(route);
      vm.routesRaw.push(response.data[i]);
    }
  };

  vm.editRoute = function(route) {
    vm.error = false;

    for (var i = 0; i < vm.routesRaw.length; i++) {
      if (vm.routesRaw[i].id === route.id) {
        vm.newRoute = vm.routesRaw[i];
        console.log(vm.routesRaw[i]);
      }
    }
  };

  vm.create = function() {
    vm.error = false;

    $http
      .post('/route/create', vm.newRoute)
      .then(vm.reload);
  };

  vm.closeRoute = function(route) {
    $http
      .post('/route/close', {id: route.id})
      .then(vm.notifyClosed);
  };

  vm.notifyClosed = function(res) {
    if (res.data.success) {
      vm.reload();
    }
  };

  vm.reload = function() {
    $http
      .get('/city/list')
      .then(vm.loadCities);

    $http
      .get('/company/list')
      .then(vm.loadCompanies);

    $http
      .get('/route/list')
      .then(vm.loadRoutes);
  };

  vm.reload();
}
