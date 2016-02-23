var Gantt = function(processed_data, div, size, scales) {

  this.div = div;
  this.processed_data = processed_data;

  GridChart.call(this, div, size, ["Time", "Tasks"], scales, {
    top: 20,
    bottom: 80,
    left: 80,
    right: 20
  });

  this.tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return Math.floor((d.end - d.start) / (1000 * 60 * 60 * 24)) + " days";
    });

  this.bar_width = this.width / processed_data.length;

};

Gantt.prototype = Object.create(GridChart.prototype);

Gantt.prototype.add_tasks = function() {

  var x_scale = this.x,
    y_scale = this.y,
    bar_width = this.bar_width;

  this.chart_area.call(this.tip);
  this.chart_area.selectAll(".task")
    .data(this.processed_data)
    .enter()
    .append("rect")
    .attr("class", "task")
    .attr("y", function(d) {
      return y_scale(d.task) - bar_width / 6;
    })
    .attr("x", function(d) {
      return x_scale(d.start);
    })
    .attr("height", this.bar_width / 3)
    .attr("width", function(d) {
      return x_scale(d.end) - x_scale(d.start);
    })
    .on('mouseover', this.tip.show)
    .on('mouseout', this.tip.hide);

  return this;

};

function gantt(data, div, size) {

  var inline_parser = function(data) {

    var parse_date = d3.time.format("%d/%m/%Y").parse;

    //Parse the dates
    data.forEach(function(d) {
      d.start = parse_date(d.start);
      d.end = parse_date(d.end);
    });


    data.sort(function(a, b) {
      return b.start - a.start;
    });

    return data;

  };


  var csv_parser = function(data) {

    //To be written

  };

  var draw = function(processed_data, div, size) {

    var starts = processed_data.map(function(d) {
      return d.start;
    });

    var ends = processed_data.map(function(d) {
      return d.end;
    });

    var x_values = starts.concat(ends);

    var y_values = processed_data.map(function(d) {
      return d.task;
    });

    var scales = [create_scale(x_values, d3.time.scale()), create_scale(y_values, d3.scale.ordinal())];


    var glasseye_chart = new Gantt(processed_data, div, size, scales);
    glasseye_chart.add_svg().add_grid().add_tasks();

  };

  build_chart(data, div, size, undefined, csv_parser, inline_parser, draw);

}
