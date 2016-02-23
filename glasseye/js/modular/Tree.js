var Tree = function(processed_data, div, size) {

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

  var cluster = d3.layout.tree()
    .size([this.height, this.width]);

  this.nodes = cluster.nodes(processed_data),
    this.links = cluster.links(this.nodes);

  this.diagonal = d3.svg.diagonal()
    .projection(function(d) {
      return [d.y, d.x];
    });

};

Tree.prototype = Object.create(GlasseyeChart.prototype);

Tree.prototype.add_tree = function() {

  var link = this.chart_area.selectAll(".treelink")
    .data(this.links)
    .enter().append("path")
    .attr("class", "treelink")
    .attr("d", this.diagonal);

  var node = this.chart_area.selectAll(".treenode")
    .data(this.nodes)
    .enter().append("g")
    .attr("class", "treenode")
    .attr("transform", function(d) {
      return "translate(" + d.y + "," + d.x + ")";
    });

  node.append("circle")
    .attr("r", 4.5);

  var abbr_len = (this.size === "full_page") ? 20 : 10;

  node.append("text")
    .attr("dx", function(d) {
      return d.children ? -8 : 8;
    })
    .attr("dy", 3)
    .style("text-anchor", function(d) {
      return d.children ? "end" : "start";
    })
    .text(function(d) {
      return abbrev(d.name, abbr_len);
    });

};


function tree(data, div, size) {

  var inline_parser = function(data) {
    return data;
  };

  var csv_parser = function(data) {
    return data;
  };

  var draw = function(processed_data, div, size) {

    var glasseye_chart = new Tree(processed_data, div, size);

    glasseye_chart.add_svg().add_tree();

  };

  build_chart(data, div, size, undefined, csv_parser, inline_parser, draw);


}
