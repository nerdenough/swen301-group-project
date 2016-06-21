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
    vm.displayAnalytics();
  };
/*******************************************************************////
  vm.displayAnalytics = function() {
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

      //Destinations
      destin_dim = ndx.dimension(function(d){
        return d.destination;
      });
      destin_group = destin_dim.group().reduceSum(function(d) {
        return 1;
      });

      destin_PI_chart = dc.pieChart('#destinationPiChart');
      destin_PI_chart
        .dimension(destin_dim)
        .group(destin_group)
        .legend(dc.legend())
        .height(300);

      //Origin
      destin_dim = ndx.dimension(function(d){
        return d.origin;
      });
      destin_group = destin_dim.group().reduceSum(function(d) {
        return 1;
      });

      destin_PI_chart = dc.pieChart('#originPiChart');
      destin_PI_chart
        .dimension(destin_dim)
        .group(destin_group)
        .legend(dc.legend())
        .height(300);

        //profit to expenditure
      profit_Dim = ndx.dimension(function(d){
        if (d.price - d.cost > 0){
          return 'Profit';
        }
        return 'Loss';
      });

      profit_Group = profit_Dim.group().reduceSum(function(d) {return Math.abs(d.price - d.cost);});

      profit_Chart = dc.pieChart('#profitsChart');
      profit_Chart
        .dimension(profit_Dim)
        .group(profit_Group)
        .legend(dc.legend())
        .height(300);

        // delivery by month
        var monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
      month_dim = ndx.dimension(function(d) {return monthNames[d.time.getMonth()]});
      month_group = month_dim.group().reduceSum(function(d){return 1;});

      month_Line_Chart = dc.rowChart('#monthLineChart');
      month_Line_Chart.xAxis().tickFormat(function(d) {
              if (d % 1 == 0) {
                return d3.format('.f')(d)
              } else {
                return ""
              }
            }
            );
      month_Line_Chart
        .dimension(month_dim)
        .group(month_group)
        .ordering(function(d){
          switch(d.key) {
        case "January": return 1;
        case "February": return 2;
        case "March": return 3;
        case "April": return 4;
        case "May": return 5;
        case "June": return 6;
        case "July": return 7;
        case "August": return 8;
        case "September": return 9;
        case "October": return 10;
        case "November": return 11;
        case "December": return 12;
      }
        })
        .height(450);


        // route type
        type_dim = ndx.dimension(function(d){
          return d.route.route_type;
        })
        type_group = type_dim.group().reduceSum(function(d){return 1});

        type_chart = dc.pieChart('#routeChart');
        type_chart
          .dimension(type_dim)
          .group(type_group)
          .legend(dc.legend())
          .height(300);


          wv_dim = ndx.dimension(function(d){
            return d.origin + '-' + d.destination;
          });

          wv_group = wv_dim.group()
          .reduce(
            function (p, val) {
                p.number++;
                p.weight += val.weight;
                p.volume += val.volume;
                x = val.duration / 3600000;
                p.duration += x;
                return p;
            },
            function (p, val) {
              p.number--;
              p.weight -= val.weight;
              p.volume -= val.volume;
              x = val.duration / 3600000;
              p.duration -= x;

                return p;
            },
            function () {
                return {number: 0, weight: 0, volume: 0, duration: 0};
            }
          );

          vwChart = dc.dataTable('#VWTable');
          vwChart
            .height(450)
            .dimension(wv_group)
            .order(d3.descending)
            .group(function() {return ''})
            .columns([
                      function(d) {return d.key},
                      function(d) {
                        if(d.value.volume < 0) return 0.00;
                        return parseFloat(d.value.volume).toFixed(2);
                      },
                      function(d) {
                        if(d.value.weight < 0) return 0.00;
                        return parseFloat(d.value.weight).toFixed(2);
                      },
                      function(d) {
                        val = parseFloat(d.value.duration / d.value.number).toFixed(2)
                        if(val === 'NaN' || val < 0) return 0.00;
                        else return val;
                      }
                    ]);



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
