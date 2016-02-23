var Force = function(processed_data, div, size) {

  var margin = (size === "full_page") ? {
    top: 5,
    bottom: 5,
    left: 100,
    right: 100
  } : {
    top: 5,
    bottom: 5,
    left: 50,
    right: 50
  };

  GlasseyeChart.call(this, div, size, margin, 300);

  this.processed_data = processed_data;

  //Set up the force layout
  this.force = d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([this.width, this.height]);

  this.tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return d.name;
    });

};


Force.prototype = Object.create(GlasseyeChart.prototype);

Force.prototype.add_force = function() {

  var color = d3.scale.category20();

  this.chart_area.call(this.tip);

  //Creates the graph data structure out of the json data
  this.force.nodes(this.processed_data.nodes)
    .links(this.processed_data.links)
    .start();

  //Create all the line svgs but without locations yet
  var link = this.chart_area.selectAll(".forcelink")
    .data(this.processed_data.links)
    .enter().append("line")
    .attr("class", "forcelink")
    .style("stroke-width", function(d) {
      return Math.sqrt(d.value);
    });

  //Do the same with the circles for the nodes - no
  var node = this.chart_area.selectAll(".forcenode")
    .data(this.processed_data.nodes)
    .enter().append("circle")
    .attr("class", "forcenode")
    .attr("r", 8)
    .style("fill", function(d) {
      return color(d.group);
    })
    .call(this.force.drag)
    .on('mouseover', this.tip.show)
    .on('mouseout', this.tip.hide);

  //Now we are giving the SVGs co-ordinates - the force layout is generating the co-ordinates which this code is using to update the attributes of the SVG elements
  this.force.on("tick", function() {
    link.attr("x1", function(d) {
        return d.source.x;
      })
      .attr("y1", function(d) {
        return d.source.y;
      })
      .attr("x2", function(d) {
        return d.target.x;
      })
      .attr("y2", function(d) {
        return d.target.y;
      });

    node.attr("cx", function(d) {
        return d.x;
      })
      .attr("cy", function(d) {
        return d.y;
      });
  });

};

function force(data, div, size) {

  var inline_parser = function(data) {
    return data;
  };

  var csv_parser = function(data) {
    return data;
  };

  var draw = function(processed_data, div, size) {

    var glasseye_chart = new Force(processed_data, div, size);

    glasseye_chart.add_svg().add_force();

  };

  build_chart(data, div, size, undefined, csv_parser, inline_parser, draw);


}
