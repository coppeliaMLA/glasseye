var Donut = function(processed_data, div, size) {

  margin = {
    top: 5,
    bottom: 5,
    left: 5,
    right: 5
  };

  GlasseyeChart.call(this, div, size, margin);

  this.processed_data = processed_data;

  var total_value = d3.sum(processed_data.map(function(d) {
    return d.value;
  }));

  this.tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return d.data.label + "<br><br>" + d.data.value + "<br><br>" + d3.format("%")(d.data.value / total_value);
    });

  var radius = this.height / 2;

  this.arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70);

  this.pie = d3.layout.pie()
    .sort(null)
    .value(function(d) {
      return d.value;
    });

};


Donut.prototype = Object.create(GlasseyeChart.prototype);

Donut.prototype.add_donut = function() {

  var svg_donut = this.chart_area.append("g")
    .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

  var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  svg_donut.call(this.tip);

  var g = svg_donut.selectAll(".arc")
    .data(this.pie(this.processed_data))
    .enter().append("g")
    .attr("class", "arc");

  g.append("path")
    .attr("d", this.arc)
    .style("fill", function(d) {
      return color(d.data.label);
    })
    .on('mouseover', this.tip.show)
    .on('mouseout', this.tip.hide);

  var arc = this.arc;

  g.append("text")
    .attr("transform", function(d) {
      return "translate(" + arc.centroid(d) + ")";
    })
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .text(function(d) {
      if (d.endAngle - d.startAngle > 0.35) {
        return d.data.label;
      } else {
        return "";
      }
    });

};

function donut(data, div, size) {

  var inline_parser = function(data) {

    processed_data = [];

    for (i = 0; i < data.values.length; i++) {
      data_item = {
        "label": data.labels[i],
        "value": +data.values[i]
      };
      processed_data.push(data_item);

    }

    return processed_data;

  };

  var csv_parser = function(data) {
    return data;
  };

  var draw = function(processed_data, div, size) {

    var glasseye_chart = new Donut(processed_data, div, size);

    glasseye_chart.add_svg().add_donut();

  };

  build_chart(data, div, size, undefined, csv_parser, inline_parser, draw);

}
