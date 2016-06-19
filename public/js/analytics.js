
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

    },
    error: function (err){
      debugger;
    }
  });
});
