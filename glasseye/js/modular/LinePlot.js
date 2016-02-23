var LinePlot = function(processed_data, div, size, labels, scales) {

  GridChart.call(this, div, size, labels, scales);

  this.processed_data = processed_data;

  //Some customisations
  this.margin.left = 4;
  this.y_axis.tickFormat("");

  this.tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return d3.format(".3n")(d.y);
    });

  var x_scale = this.x,
    y_scale = this.y;

  this.line = d3.svg.line()
    .x(function(d) {
      return x_scale(d.x);
    })
    .y(function(d) {
      return y_scale(d.y);
    });

};

LinePlot.prototype = Object.create(GridChart.prototype);

LinePlot.prototype.add_line = function() {

  this.chart_area.call(this.tip);

  this.chart_area.append("path")
    .datum(this.processed_data)
    .attr("class", "line")
    .attr("d", this.line);

  var x_scale = this.x,
    y_scale = this.y;

  this.chart_area.selectAll("line_points")
    .data(this.processed_data)
    .enter()
    .append("circle")
    .attr("class", "line_points")
    .attr("cx", function(d) {
      return x_scale(d.x);
    })
    .attr("cy", function(d) {
      return y_scale(d.y);
    })
    .attr("r", 10)
    .attr("opacity", 0)
    .on('mouseover', this.tip.show)
    .on('mouseout', this.tip.hide);

  return this;

};

function lineplot(data, div, size, labels) {


  var inline_parser = function(data) {

    var processed_data = [];

    for (i = 0; i < data.x.length; i++) {
      data_item = {
        "x": +data.x[i],
        "y": +data.y[i]
      };
      processed_data.push(data_item);
    }

    return processed_data;
  };

  var csv_parser = function(data) {

    var processed_data = data.map(function(d) {
      return {
        x: +d.x,
        y: +d.y
      };
    });

    return processed_data;

  };

  var draw = function draw_lineplot(processed_data, div, size, labels) {

    var x_values = processed_data.map(function(d) {
      return d.x;
    });
    var y_values = processed_data.map(function(d) {
      return d.y;
    });
    var scales = [create_scale(x_values, d3.scale.linear()), create_scale(y_values, d3.scale.linear())];
    var glasseye_chart = new LinePlot(processed_data, div, size, labels, scales);
    glasseye_chart.add_svg().add_grid().add_line();

  };

  build_chart(data, div, size, labels, csv_parser, inline_parser, draw);

}


function lineplot(data, div, size, labels) {


  var inline_parser = function(data) {

    var processed_data = [];

    for (i = 0; i < data.x.length; i++) {
      data_item = {
        "x": +data.x[i],
        "y": +data.y[i]
      };
      processed_data.push(data_item);
    }

    return processed_data;
  };

  var csv_parser = function(data) {

    var processed_data = data.map(function(d) {
      return {
        x: +d.x,
        y: +d.y
      };
    });

    return processed_data;

  };

  var draw = function draw_lineplot(processed_data, div, size, labels) {

    var x_values = processed_data.map(function(d) {
      return d.x;
    });
    var y_values = processed_data.map(function(d) {
      return d.y;
    });
    var scales = [create_scale(x_values, d3.scale.linear()), create_scale(y_values, d3.scale.linear())];
    var glasseye_chart = new LinePlot(processed_data, div, size, labels, scales);
    glasseye_chart.add_svg().add_grid().add_line();

  };

  build_chart(data, div, size, labels, csv_parser, inline_parser, draw);

}
