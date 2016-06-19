
$('document').ready(function(){
  $.ajax({
    url: '/data/log',
    type: 'get',
    dataType: 'json',
    success: function (data){
      /*Clean Data from string number**/
      costs = data.simulation.mail.map(function(row){
        row.ID = Number(row.ID);
        row.volume = Number(row.volume);
        row.weight = Number(row.weight);
        return row;
      });

      console.log(costs);

      /*Crossfilter**/
      var ndx = crossfilter(costs);

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
        return d.to;
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
        return d.from;
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

      //Origin
      destin_dim = ndx.dimension(function(d){
        return d.priority;
      });
      destin_group = destin_dim.group().reduceSum(function(d) {
        return 1;
      });

      destin_PI_chart = dc.pieChart('#priorityPiChart');
      destin_PI_chart
        .dimension(destin_dim)
        .group(destin_group)
        .legend(dc.legend())
        .height(300);


        dc.renderAll();
    },
    error: function (err){
      debugger;
    }
  });
});
