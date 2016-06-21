function AnalyticsController($scope, $http, $cookies) {
  var vm = this;
  vm.deliveries = [];
  vm.cities = [];
  vm.customers = [];
  vm.companies = [];
  vm.routes = [];

  vm.loadCities = function(response) {
    vm.cities = response.data;
  };

  vm.loadCustomers = function(response) {
    vm.customers = response.data;
  };

  vm.loadCompanies = function(response) {
    vm.companies = response.data;
  };

  vm.loadRoutes = function(response) {
    for (var i = 0; i < response.data.length; i++) {
      var route = response.data[i];
      route.origin = vm.cities[route.origin - 1].name;
      route.destination = vm.cities[route.destination - 1].name;
      route.company = vm.companies[route.company - 1].name;
    }

    vm.routes = response.data;
  };

  vm.loadDeliveries = function(response) {
    for (var i = 0; i < response.data.length; i++) {
      var delivery = response.data[i];
      delivery.sender = vm.customers[delivery.sender - 1].firstname;
      delivery.recipient = vm.customers[delivery.recipient - 1].firstname;
      delivery.origin = vm.cities[delivery.origin - 1].name;
      delivery.destination = vm.cities[delivery.destination - 1].name;
      delivery.route = vm.routes[delivery.route - 1];
      delivery.time = new Date(delivery.time);
    }

    vm.deliveries = response.data;
    console.log(vm.deliveries);
    vm.displayAnalytics();
  };
/*******************************************************************////
  vm.displayAnalytics = function() {
    console.log('here');
    console.log(vm.deliveries);
    ndx = crossfilter(vm.deliveries);



    //total count
      dc.dataCount('#dataCount').options({
        dimension: ndx,
        group: ndx.groupAll(),
        html: {
          some: '<strong>%filter-count</strong> selected out of <strong>%total-count</strong> records' +
                ' | <a href=\'javascript:dc.filterAll(); dc.renderAll();\'\'>Reset All</a>',
          all: 'All records selected (<strong>%total-count</strong>). Please click on the graph to apply filters.'
        }
      });




      dc.renderAll();
  };




  /******************************************************************///

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

  // vm.displayAnalytics();
}
