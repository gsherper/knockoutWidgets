function seriesData(label,data,opts) {
  var self = this;
  self.label = ko.observable(label);
  self.data = ko.observable(data);
  self.opts = ko.observable(opts);
}

//Knockout custom binding - flot
ko.bindingHandlers.flot = {
  init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
     $(window).resize(function() {
    var observable = valueAccessor(); 
    var oo = [];
    var series = observable();
    /*$.each(series, function(ii,vv) {
      var ooo = [];
      $.each(vv.data(), function(i,v) {
        ooo.push([new Date(v[0]).getTime(),v[1]]);
       });
       oo.push(ooo);
    });
      $.plot(element, oo,  viewModel.opt());
    });*/
$.each(series, function(ii,vv) {
      var ooo = [];
      $.each(vv.data(), function(i,v) {
        ooo.push([new Date(v[0]).getTime(),v[1]]);
       });
var data = { data: ooo };
var graphData = {};
$.extend(true, graphData, data, vv.opts());
       oo.push(graphData);
    });
    console.log('updating...');
      $.plot(element, oo,  viewModel.opt());
});
  },
  update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
    var observable = valueAccessor(); 
    var oo = [];
    var series = observable();
    $.each(series, function(ii,vv) {
      var ooo = [];
      $.each(vv.data(), function(i,v) {
        ooo.push([new Date(v[0]).getTime(),v[1]]);
       });
var data = { data: ooo };
var graphData = {};
$.extend(true, graphData, data, vv.opts());
       oo.push(graphData);
    });
    console.log('updating...');
    $.plot($(element), oo, viewModel.opt());
  }    
};

function FlotViewModel(data) {
  this.data = data;
  this.series = ko.observableArray([]);
  this.opt = ko.observable({
    xaxis: { 
      mode: 'time',
        tickFormatter: function (val, axis) {
          var d = new Date(val);
          return (d.getUTCMonth() + 1) +'/'+d.getUTCDate() + "/"  +String(d.getUTCFullYear()).substring(2);
        } 
    }
  }); 
  this.addSeries = function(dat) {
    this.series.push(new seriesData("Yahoo", dat));
  };
  this.init = function() {
    if (this.data) {
      console.log('init');
      this.addSeries(this.data);
    }
  }
 this.init();
}

FlotBarViewModel.prototype = new FlotViewModel();
FlotBarViewModel.prototype.constructor = FlotBarViewModel;
function FlotBarViewModel(data) {
  this.data = data;
  this.opt = ko.observable({
    xaxis: { 
    },
    series: { 
      bars: { 
        show: true,
        barWidth: 0.6,
        align: 'center'   
      }
    }
  });
  this.init();
};

FlotRegressionViewModel.prototype = new FlotViewModel();
FlotRegressionViewModel.prototype.constructor = FlotRegressionViewModel;
function FlotRegressionViewModel(data) {
  this.data = data;
  this.opt = ko.observable({
    xaxis: { 
    },
    series: { 
      lines: {
        show: false
      },
      points: {
        show: true 
      },
      color: '#04c'
    },
  });
  this.addSeries = function(dat) {
    if (dat.pts) {
      this.series.push(new seriesData("Yahoo", dat.pts));
    } 
    if (dat.line) {
      this.series.push(new seriesData("Yahoo",  dat.line, {lines: { show: true}, points: { show: false}}));
    }
  };
  this.init();
};
