var Thermometers = function(processed_data, div, size, labels, scales) {

  var self = this;

  var margin = {
    top: 50,
    bottom: 80,
    right: 30,
    left: 80
  };

  BarChart.call(self, processed_data, div, size, labels, scales, margin);
  self.bar_width = self.width/7;
  self.y_axis.tickFormat(d3.format("0%")).ticks(6).tickSize(6);

};

Thermometers.prototype = Object.create(BarChart.prototype);

Thermometers.prototype.add_thermometers = function() {

  var self = this;

  self.chart_area.call(self.tip);

  //Customisations
  self.svg.attr("class", "glasseye_chart thermometers");


  var therm = self.chart_area.selectAll(".thermometer")
    .data(self.processed_data)
    .enter()
    .append("g")
    .attr("class", "thermometer")
    .attr("transform", function(d) {
      return "translate(" + (self.x(d.category) - self.bar_width / 4) + ", " + 0 + ")";
    });


  var therm_width = self.bar_width / 2;
  var merc_prop = 0.8;

  therm.append("rect")
    .attr("class", "glass")
    .attr("width", therm_width)
    .attr("height", self.height);

  therm.append("rect")
    .attr("class", "glass-gap")
    .attr("x", therm_width * (1 - merc_prop) / 2)
    .attr("width", therm_width * merc_prop)
    .attr("height", self.height);

  therm.append("text")
    .attr("class", "therm_reading")
    .text(d3.format("%")(0))
    .attr("transform", "translate(" + (self.bar_width) + ", " + self.height / 2 + ")");

  therm.append("rect")
    .attr("class", "mercury")
    .attr("x", self.bar_width / 8)
    .attr("y", self.y(0))
    .attr("width", self.bar_width / 4)
    .attr("height", self.height - self.y(0));
  self.svg.append("text").attr("class", "context")
    .attr("y", self.height + self.margin.top + 60)
    .attr("x", self.margin.left + self.width / 2)
    .style("text-anchor", "middle");

  return this;

};

Thermometers.prototype.update_thermometers = function(time, variable) {

  var self = this;
  self.chart_area.selectAll(".mercury")
    //.attr("class", function(d,i){return("mercury d_"+ i)})
    .transition()
    .duration(500)
    .attr("y", function(d) {
      var filtered = d.values.filter(function(e) {
        return e.time.getTime() === time.getTime() & e.variable === variable;
      });
      return self.y(filtered[0].value);
    })
    .attr("height", function(d) {
      var filtered = d.values.filter(function(e) {
        return e.time.getTime() === time.getTime() & e.variable === variable;
      });

      return self.height - self.y(filtered[0].value);
    });

  self.chart_area.selectAll(".therm_reading")
    .text(function(d) {
      var filtered = d.values.filter(function(e) {
        return e.time.getTime() === time.getTime() & e.variable === variable;
      });
      return d3.format("%")(filtered[0].value);
    });

  self.svg.selectAll(".context").text("At " + quarter_year(time) + " for " + variable);



};

Thermometers.prototype.add_title = function(title) {

  var self = this;
  self.svg.append('text').attr("class", "title")
    .text(title)
    .attr("transform", "translate(" + (self.margin.left - 10) + ",20)");

  return this;

};


Thermometers.prototype.redraw_thermometer = function(title) {

  var self = this;

  //Delete the existing svg and commentary
  d3.select(self.div).selectAll("svg").remove();

  //Reset the size
  self.set_size();
  self.bar_width = self.width /7;
  self.x = self.scales[0].scale_func.rangePoints([0, self.width], 1);

  //Redraw the chart
  self.add_svg().add_grid().add_thermometers().add_title(title);

};

function thermometers(data, div, size) {

  var inline_parser = function(data) {

    processed_data = [];

    for (i = 0; i < data.value.length; i++) {
      data_item = {
        "category": data.category[i],
        "value": +data.value[i]
      };
      processed_data.push(data_item);

    }

    return processed_data;

  };

  var csv_parser = function(data) {

    var parse_date = d3.time.format("%d/%m/%Y").parse;
    var processed_data = data.map(function(d) {
      return {
        category: d.category,
        filter: d.filter,
        value: d.value,
        time: parse_date(d.time)
      };
    });

    return processed_data;

  };

  var draw = function(processed_data, div, size) {

    var x_values = processed_data.map(function(d) {
      return d.category;
    });
    var y_values = processed_data.map(function(d) {
      return d.value;
    });

    var scales = [create_scale(x_values, d3.scale.ordinal()), create_scale(y_values, d3.scale.linear())];

    var glasseye_chart = new Thermometers(processed_data, div, size, ["category", "value"], scales);

    glasseye_chart.add_svg().add_grid().add_thermometers();

  };

  build_chart(data, div, size, undefined, csv_parser, inline_parser, draw);


}
