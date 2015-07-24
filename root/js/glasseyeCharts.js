
function donut(data, div) {

    //Format data

    processed_data = []

    for (i = 0; i < data.values.length; i++) {
        data_item = {
            "label": data.labels[i],
            "value": data.values[i]
        };
        processed_data.push(data_item);
    }

    //Need to add margin to bring it into line with other charts

    var width = 300,
        height = 300,
        margin = {top: 20, right: 40, bottom: 30, left: 40};
    
    radius = (width - margin.left - margin.right) / 2;

    var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 70);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
            return d.value;
        });

    var svg_donut = d3.select(div).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var g = svg_donut.selectAll(".arc")
        .data(pie(processed_data))
        .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) {
            return color(d.data.label);
        });

    g.append("text")
        .attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")";
        })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data.label;
        });

}




function treemap(data,div){
    
var w = 300,
    h = 200,
    x = d3.scale.linear().range([0, w]),
    y = d3.scale.linear().range([0, h]),
    color = d3.scale.category20c(),
    root,
    node;

var treemap = d3.layout.treemap()
    .round(false)
    .size([w, h])
    .sticky(true)
    .value(function(d) { return d.size; });

var svg = d3.select(div)
  .append("svg:svg")
    .attr("width", w)
    .attr("height", h)
  .append("svg:g")
    .attr("transform", "translate(.5,.5)");

  node = root = data;

  var nodes = treemap.nodes(root)
      .filter(function(d) { return !d.children; });

  var cell = svg.selectAll("g")
      .data(nodes)
    .enter().append("svg:g")
      .attr("class", "cell")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .on("click", function(d) { return zoom(node == d.parent ? root : d.parent); });

  cell.append("svg:rect")
      .attr("width", function(d) { return d.dx - 1; })
      .attr("height", function(d) { return d.dy - 1; })
      .style("fill", function(d) { return color(d.parent.name); });

  cell.append("svg:text")
      .attr("x", function(d) { return d.dx / 2; })
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.name; })
      .style("opacity", function(d) { d.w = this.getComputedTextLength(); return d.dx > d.w ? 1 : 0; });

        d3.select(window).on("click", function() { zoom(root); });

  d3.select("select").on("change", function() {
    treemap.value(this.value == "size" ? size : count).nodes(root);
    zoom(node);
  });

function size(d) {
  return d.size;
}

function count(d) {
  return 1;
}

function zoom(d) {
  var kx = w / d.dx, ky = h / d.dy;
  x.domain([d.x, d.x + d.dx]);
  y.domain([d.y, d.y + d.dy]);

  var t = svg.selectAll("g.cell").transition()
      .duration(d3.event.altKey ? 7500 : 750)
      .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

  t.select("rect")
      .attr("width", function(d) { return kx * d.dx - 1; })
      .attr("height", function(d) { return ky * d.dy - 1; })

  t.select("text")
      .attr("x", function(d) { return kx * d.dx / 2; })
      .attr("y", function(d) { return ky * d.dy / 2; })
      .style("opacity", function(d) { return kx * d.dx > d.w ? 1 : 0; });

  node = d;
  d3.event.stopPropagation();
}


}






function line_chart(data, div){

    processed_data = []

    for (i = 0; i < data.x.length; i++) {
        data_item = {
            "x": data.x[i],
            "y": data.y[i]
        };
        processed_data.push(data_item);
    }

    console.log(processed_data);

    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return d.y;
    })

    var svg_width = 300, svg_height = 250;

    var margin = {top: 20, right: 20, bottom: 30, left: 20},
    width = svg_width - margin.left - margin.right,
    height = svg_height - margin.top - margin.bottom;

    var x = d3.scale.linear()
    .range([0, width])
    .domain([d3.min(processed_data, function(d){return d['x']})-1,d3.max(processed_data, function(d){return d["x"]})+1]);

    var y = d3.scale.linear()
    .range([height, 0])
    .domain([d3.min(processed_data, function(d){return d['y']})-10,d3.max(processed_data, function(d){return d['y']})+10]);

    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(-height, 0, 0);

    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickSize(-width, 0, 0)
    .tickFormat("");

    var line = d3.svg.line()
    .x(function(d) { return x(d["x"]); })
    .y(function(d) { return y(d["y"]); });

    var area = d3.svg.area()
    .x(function(d) { return x(d["x"]);  })
    .y0(height)
    .y1(function(d) { return y(d["y"]); });

    var svg = d3.select(div).append("svg")
    .attr("width", svg_width)
    .attr("height", svg_height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    svg.append("g")
    .attr("class", "chart_grid")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

    svg.append("g")
    .attr("class", "chart_grid")
    .call(yAxis);

    svg.append("path")
    .datum(processed_data)
    .attr("class", "line")
    .attr("d", line);

    svg.selectAll("line_points")
    .data(processed_data)
    .enter()
    .append("circle")
    .attr("class", "line_points")
    .attr("cx", function(d) { return x(d["x"]); })
    .attr("cy", function(d) { return y(d["y"]);  })
    .attr("r", 10)
    .attr("opacity", 0)
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);
}
