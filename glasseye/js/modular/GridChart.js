var GridChart = function(div, size, labels, scales, margin, height) {

  var self = this;
  self.scales = scales;
  self.labels = labels;

  GlasseyeChart.call(self, div, size, margin, height);

  if (scales[0].scale_type === "ordinal") {
    self.x = self.scales[0].scale_func.rangePoints([0, self.width], 1);
  } else {
    self.x = self.scales[0].scale_func.range([0, self.width]);
  }

  if (scales[1].scale_type === "ordinal") {
    self.y = self.scales[1].scale_func.rangePoints([self.height, 0], 1);
  } else {
    self.y = self.scales[1].scale_func.range([self.height, 0]);
  }


  self.x_axis = d3.svg.axis()
    .scale(self.x)
    .orient("bottom")
    .tickSize(-self.height, 0, 0)
    .tickPadding(10);

  self.y_axis = d3.svg.axis()
    .scale(self.y)
    .orient("left")
    .tickSize(-self.width, 0, 0);

};

GridChart.prototype = Object.create(GlasseyeChart.prototype);

GridChart.prototype.add_grid = function() {

  var self = this;

  var x_axis_g = self.chart_area.append("g")
    .attr("class", "chart_grid x_axis")
    .attr("transform", "translate(0," + self.height + ")")
    .call(self.x_axis);

  if (self.scales[0].scale_type === "nonlinear") {
    x_axis_g.selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-90)");
  }

  self.chart_area.append("g")
    .attr("class", "chart_grid y_axis")
    .call(self.y_axis);

  //Add labels if they have been provided

  if (typeof self.labels !== "undefined") {
    self.svg.append("g")
      .attr("class", "axis_label")
      .attr("transform", "translate(" + (self.margin.left + self.width + 15) + ", " + (self.height + self.margin.top) + ") rotate(-90)")
      .append("text")
      .text(self.labels[0]);

    self.svg.append("g")
      .attr("class", "axis_label")
      .attr("transform", "translate(" + self.margin.left + ", " + (self.margin.top - 8) + ")")
      .append("text")
      .text(self.labels[1]);
  }

  return self;

};
