function seriesData(label,data,opts) {
  var self = this;
  self.label = ko.observable(label);
  self.data = ko.observable(data);
  self.opts = ko.observable(opts);
}

//Knockout custom binding - flot
ko.bindingHandlers.flot = {
  init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
    var context = this;
    $(window).resize(function() {
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
       context.plot = $.plot(element, oo,  viewModel.opt());
    });
  },
  update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
    var observable = valueAccessor(); 
    var oo = [];
    var series = observable();
    var opt = viewModel.opt();
    var xaxisMode = '';
    if (opt.xaxis) {
      xaxisMode = opt.xaxis.mode;
    }
    $.each(series, function(ii,vv) {
      var ooo = [];
      if (xaxisMode ==  'time') {
        var ooo = [];
        $.each(vv.data(), function(i,v) {
          ooo.push([new Date(v[0]).getTime(),v[1]]);
        });
        var data = { data: ooo };
      } else {
        var data = { data: vv.data() };
      }

      var graphData = {};
      $.extend(true, graphData, data, vv.opts());
        oo.push(graphData);
      });
      if (viewModel.opt().stream) {
        if (!this.plot) {
          this.plot = $.plot($(element), oo, viewModel.opt());
        } else {
          this.plot.setData(oo);
          this.plot.draw();
        }
      } else {
        this.plot = $.plot($(element), oo, viewModel.opt());
      }
  }    
};

function FlotViewModel(data, options) {
  this.data = data;
  this.series = ko.observableArray([]);
  var defaults = {
      xaxis: {
        mode: 'time',
          tickFormatter: function (val, axis) {
            var d = new Date(val);
            return (d.getUTCMonth() + 1) +'/'+d.getUTCDate() + "/"  +String(d.getUTCFullYear()).substring(2);
          }
      }
  };
  if (!options) {
    this.opt = ko.observable(defaults);
  } else {
    this.opt = ko.observable(options);
  }
  this.streamUpdate = function(dat, label) {
    this.series.pop();
    this.series.push(new seriesData(label, dat));
  }
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
