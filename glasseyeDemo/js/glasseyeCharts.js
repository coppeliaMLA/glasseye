function donut(data, div, size) {

    //Is data a file name or a json object


    if (typeof data === "object")

    {


        processed_data = []

        for (i = 0; i < data.values.length; i++) {
            data_item = {
                "label": data.labels[i],
                "value": +data.values[i]
            };
            processed_data.push(data_item);



        }

        draw_donut(processed_data, div, size);

    } else

    {


        d3.csv(data, function(error, processed_data) {

            draw_donut(processed_data, div, size);

        });

    }

}



function draw_donut(processed_data, div, size) {

    var total_value = d3.sum(processed_data.map(function(d){return d.value}));

    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return d.data.label + "<br><br>" + d.data.value + "<br><br>" + d3.format("%")(d.data.value/total_value) ;
    });
    /*.offset(function() {
        return [this.getBBox().height / 2, 0]
    });
*/

    //Need to add margin to bring it into line with other charts


    if (size === "full_page") {



    var width = 600,
        height = 400,
        margin = {top: 20, right: 40, bottom: 30, left: 40};

    }

    else {

    var width = 300,
        height = 300,
        margin = {top: 20, right: 40, bottom: 10, left: 40};

    }
    
    radius = (height - margin.top - margin.bottom) / 2;

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

    svg_donut.call(tip);

    var g = svg_donut.selectAll(".arc")
        .data(pie(processed_data))
        .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) {
            return color(d.data.label);
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    g.append("text")
        .attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")";
        })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function(d) {
            if (d.endAngle - d.startAngle > 0.35){
            return d.data.label;
        } else {
            return "";
        }
        });

}




function treemap(data,div){
    
var w = 300,
    h = 400,
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
      //.style("opacity", function(d) { d.w = this.getComputedTextLength(); return d.dx > d.w ? 1 : 0; })
      .call(wrap, 80);

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
      .attr("y", function(d) { return ky * d.dy / 2; });
      //.style("opacity", function(d) { return kx * d.dx > d.w ? 1 : 0; });

  node = d;
  d3.event.stopPropagation();
}


}


function line_plot(data, div, labels) {

    //Is data a file name or a json object


    if (typeof data === "object")

    {

        processed_data = []

        for (i = 0; i < data.x.length; i++) {
            data_item = {
                "x": +data.x[i],
                "y": +data.y[i]
            };
            processed_data.push(data_item);
        }

        draw_line_plot(processed_data, div, labels);

    } else

    {


        d3.csv(data, function(error, processed_data) {

        processed_data = processed_data.map(function(d){
            return {
                x: +d.x,
                y: +d.y
            }
        });

        draw_line_plot(processed_data, div, labels);

        });

    }

}


function draw_line_plot(processed_data, div, labels){

    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return d3.format(".3n")(d.y);
    })

    var svg_width = 300, svg_height = 250;

    var margin = {top: 30, right: 20, bottom: 30, left: 0},
    width = svg_width - margin.left - margin.right,
    height = svg_height - margin.top - margin.bottom;

    var min_x = d3.min(processed_data, function(d){return d.x}),
    max_x = d3.max(processed_data, function(d){return d.x}),
    min_y = d3.min(processed_data, function(d){return d.y}),
    max_y = d3.max(processed_data, function(d){return d.y}),
    range_x = max_x - min_x,
    range_y = max_y - min_y;

    //Work out the ratio of the range of y to max_y

    var range_max_ratio = range_y/max_y

    var y = d3.scale.linear()
    .range([height, 0]);

    if (range_max_ratio < 0.2) {
         y.domain([min_y-0.1*range_y, max_y+0.1*range_y]).nice;
        } else
    {
        y.domain([0, max_y+0.1*range_y]).nice;
    }

    var x = d3.scale.linear()
    .range([0, width])
    .domain([min_x-0.1*range_x, max_x+0.1*range_x,]);

    
    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(-height, 0, 0)
    .tickPadding(10);

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
    .attr("height", svg_height);

    var chart_area = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    chart_area.call(tip);

    chart_area.append("g")
    .attr("class", "chart_grid")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

    chart_area.append("g")
    .attr("class", "chart_grid")
    .call(yAxis);

    chart_area.append("path")
    .datum(processed_data)
    .attr("class", "line")
    .attr("d", line);

    chart_area.selectAll("line_points")
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

    //Add labels if they have been provided

    if (typeof labels !== "undefined"){
        svg.append("g")
        .attr("class", "axis_label")
        .attr("transform", "translate(" + (margin.left + width + 15) + ", " + (height + margin.top) + ") rotate(-90)")
        .append("text")
        .text(labels[0]);

        svg.append("g")
        .attr("class", "axis_label")
        .attr("transform", "translate(" + margin.left + ", " + (margin.top - 8) + ")")
        .append("text")
        .text(labels[1]);
    }


}



function sim_plot(file, div) {

    //Set up the layout variables

    var svg_width = 650,
        svg_height = 400;

    var margin = {
            top: 20,
            right: 250,
            bottom: 30,
            left: 30
        },
        width = svg_width - margin.left - margin.right,
        height = svg_height - margin.top - margin.bottom;


    d3.csv(file, function(error, data) {


        //Set up color scales
        var color = d3.scale.category20()

        //Read in the different varaiations and simulations
        var variations = [];
        data.map(function(d) {
            if (variations.indexOf(d.variation) === -1) {
                variations.push(d.variation)
            }
        });



        var simulations = [];
        data.map(function(d) {
            if (simulations.indexOf(d.sim_num) === -1) {
                simulations.push(d.sim_num)
            }
        });

        //Create the json data from the csv data
        var processed_data = variations.map(function(v) {

            return {
                variation: v,
                simulations: simulations.map(function(s) {
                    return {
                        simulation: +s,
                        values: data.filter(function(d) {
                            return d.variation === v && d.sim_num === s
                        }).map(function(e) {
                            return {
                                value: +e.value,
                                iter: +e.day
                            }
                        })
                    }
                })
            }

        });



        //Set up the scales
        var x = d3.scale.linear()
            .range([0, width])
            .domain([d3.min(data, function(d) {
                return +d["day"]
            })-10, d3.max(data, function(d) {
                return +d["day"]
            })]);

        var y = d3.scale.linear()
            .range([height, 0])
            .domain([d3.min(data, function(d) {
                return +d['value']
            }), d3.max(data, function(d) {
                return +d['value']
            })]);

        //Set up the axes
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickSize(-height, 0, 0);

        var yAxis = d3.svg.axis()
            .scale(y)
            .tickSize(-width, 0, 0)
            .orient("left");

        //Add the svg
        var svg = d3.select(div).append("svg")
            .attr("width", svg_width)
            .attr("height", svg_height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //Add the axes
        svg.append("g")
            .attr("class", "chart_grid")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "chart_grid")
            .call(yAxis);

        //Create a path function
        var line = d3.svg.line()
            .interpolate("linear")
            .x(function(d) {
                return x(d.iter);
            })
            .y(function(d) {
                return y(d.value);
            });

        //var totalLength = width + 200; //At some point base this on path length

        //Add the simulation paths for each variation

        processed_data.forEach(function(v, j) {


            var path = svg.selectAll(".variations")
                .data(v.simulations)
                .enter()
                .append("g")
                .append("path")
                .attr("class", "line")
                .attr("d", function(d) {
                    return line(d.values);
                })
                .style("stroke", function(d) {
                    return color(v.variation);
                })
                .attr("opacity", function(d) {
                    if (d.simulation === -1) {
                        return 1
                    } else {
                        return 0.1
                    }
                });


                path.each(function(d) { d.totalLength = this.getTotalLength(); })
                .attr("stroke-dasharray", function(d) { return d.totalLength + " " + d.totalLength; })
                .attr("stroke-dashoffset", function(d) { return d.totalLength; })
                .transition()
                .delay(j * 7000)
                .duration(7000)
                .ease("linear")
                .attr("stroke-dashoffset", 0)
                .transition()
                .duration((variations.length-1-j)*7000)
                .attr("stroke-dashoffset", 0)
                .each("end", repeat);


                function repeat() {
                    var path = d3.select(this);
                    path.attr("stroke-dasharray", function(d) { return d.totalLength + " " + d.totalLength; })
                        .attr("stroke-dashoffset", function(d) { return d.totalLength; })
                        .transition()
                        .delay(j * 7000)
                        .duration(7000)
                        .ease("linear")
                        .attr("stroke-dashoffset", 0)
                        .transition()
                        .duration((variations.length-1-j)*7000)
                        .attr("stroke-dashoffset", 0)
                        .each("end", repeat);
                }


        });


    if (variations.length > 1) {

       add_legend(svg, width+margin.left, margin.top, variations.map(function(v){ return {"label": v, "colour": color(v)}}));
    }

    });

}

function dot_plot(file, div){

    //Set up the layout variables

    var svg_width = 650,
        svg_height = 400;

    var margin = {
            top: 20,
            right: 250,
            bottom: 110,
            left: 30
        },
        width = svg_width - margin.left - margin.right,
        height = svg_height - margin.top - margin.bottom;

    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return d.value;
    })


    d3.csv(file, function(error, data) {


        //Set up color scales
        var color = d3.scale.category10()

        //Read in the different varaiations and simulations
        var groups = [];
        data.map(function(d) {
            if (groups.indexOf(d.group) === -1) {
                groups.push(d.group)
            }
        });


        //Read in the different varaiations and simulations
        var variables = [];
        data.map(function(d) {
            if (variables.indexOf(d.variable) === -1) {
                variables.push(d.variable)
            }
        });


        //Create the json data from the csv data
        var processed_data = groups.map(function(g) {

            return {
                group: g,
                values: data.filter(function(d) { return d.group === g}).map(function(e) {
                            return {
                                value: +e.value,
                                variable: e.variable
                            }
                        })
                    }
                });


        //This where we add the ordinal scales

        var min_y = d3.min(data, function(d) {return +d['value']}),
        max_y = d3.max(data, function(d) {return +d['value']}),
        range_y = max_y - min_y;

        //Work out the ratio of the range of y to max_y

        var range_max_ratio = range_y/max_y;

        var y = d3.scale.linear()
        .range([height, 0]);

        if (range_max_ratio < 0.3) {
            y.domain([min_y-0.1*range_y, max_y+0.1*range_y]).nice;
        } else
        {
            y.domain([0, max_y]).nice;
        }

        
        //Set up the scales
        var x = d3.scale.ordinal()
            .rangePoints([0, width], 1)
            .domain(variables);

        //Set up the axes
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickSize(-height, 0, 0)
            .tickFormat(function(d){
                if (d.length > 15) {
                    return d.substring(0,15) + "..";
                } else {
                return d;
                }
            });

        var yAxis = d3.svg.axis()
            .scale(y)
            .tickSize(-width, 0, 0)
            .orient("left");

        //Add the svg
        var svg = d3.select(div).append("svg")
            .attr("width", svg_width)
            .attr("height", svg_height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.call(tip);

        //Add the axes
        svg.append("g")
            .attr("class", "chart_grid")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-90)" );

        svg.append("g")
            .attr("class", "chart_grid")
            .call(yAxis);

        
        //Add the simulation paths for each variation
        processed_data.forEach(function(v, j) {


            svg.selectAll(".dot")
                .data(v.values)
                .enter()
                .append("circle")
                .attr("cx", function(d) {return x(d.variable)})
                .attr("cy", function(d) {return y(d.value)})
                .attr("r", 6)
                .attr("fill", function(d){return color(v.group)})
                .attr("opacity", 0.5)
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);
                


        });

    if (groups.length > 1) {
    add_legend(svg, width+margin.left, margin.top, groups.map(function(v){ return {"label": v, "colour": color(v)}}));
}
    });

//Put 

//ordinal.rangePoints(interval[, padding])

}




//All purpose functions

function add_legend(svg, x, y, legend_data) {

  var legend_groups = svg.selectAll('.legend_item')
  .data(legend_data)
  .enter()
  .append('g')
  .attr('class', 'legend_item')
  .attr("transform", "translate(" + x + "," + y + ")");


  legend_groups.append("rect")
  .attr("width", 10)
  .attr("height", 10)
  .attr("x", 10)
  .attr("y", function(d,i){return i*15})
  .attr("fill", function(d,i){return d.colour});

  legend_groups.append("text")
  .attr("x", 27)
  .attr("y", function(d,i){return 8+i*15})
  .text(function(d){return d.label});

}


function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 40).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 40).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}






