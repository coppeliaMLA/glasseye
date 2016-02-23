//Glasseye chart super class: sets up the svg and the chart area
var GlasseyeChart = function(div, size, margin, custom_height) {

  var self = this;

  self.div = div;
  self.size = size;
  self.margin = margin;
  self.custom_height = custom_height;

  //Set the size of the chart
  self.set_size();

};

GlasseyeChart.prototype.set_size = function() {

  var self = this;

  //Get dimension of the div
  var rect = d3.select(self.div).node().getBoundingClientRect();

  //Set chart dimensions according to whether the chart is placed in the margin or the main page

  if (self.margin === undefined) {
    self.margin = {
      top: 20,
      bottom: 20,
      right: 20,
      left: 20
    };
  }


  if (self.size === "full_page") {
    self.svg_width = 500;
    self.svg_height = (self.custom_height === undefined) ? 300 : self.custom_height;
  } else if (self.size === "margin") {
    //self.svg_width = (rect.width < 300) ? rect.width : 300;
    self.svg_width = 300;
    self.svg_height = (self.custom_height === undefined) ? 250 : self.custom_height;
  } else if (self.size === "double_plot_wide") {
    self.svg_width = (rect.width < 600) ? rect.width : 600;
    self.svg_height = (self.custom_height === undefined) ? 360 : self.custom_height;
    //self.margin.bottom = 50;
  } else if (self.size === "double_plot_narrow"){
    self.svg_width = (rect.width < 300) ? rect.width : 300;
    self.svg_height = (self.custom_height === undefined) ? 360 : self.custom_height;
    //self.margin.bottom = 50;
  }
    else {
    self.svg_width = 300;
    self.svg_height = (self.custom_height === undefined) ? 360 : self.custom_height;
  }


  //Work out the dimensions of the chart
  self.width = self.svg_width - self.margin.left - self.margin.right;
  self.height = self.svg_height - self.margin.top - self.margin.bottom;

  //Define color scales



  return self;

};

GlasseyeChart.prototype.add_svg = function() {

  var self = this;

  //Add the svg to the div
  self.svg = d3.select(self.div).append("svg")
    .attr("class", "glasseye_chart")
    .attr("width", self.svg_width)
    .attr("height", self.svg_height);

  //Add the chart area to the svg
  self.chart_area = self.svg.append("g")
    .attr("class", "chart_area")
    .attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");

  return self;
};
