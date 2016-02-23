function treemap(data, div, size) {

  var inline_parser = function(data) {
    return data;
  }

  var csv_parser = function(data) {
    //Needs to be written
  }

  var draw = function(processed_data, div, size) {

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
      .value(function(d) {
        return d.size;
      });

    var svg = d3.select(div)
      .append("svg:svg")
      .attr("width", w)
      .attr("height", h)
      .append("svg:g")
      .attr("transform", "translate(.5,.5)");

    var node = root = data;

    var nodes = treemap.nodes(root)
      .filter(function(d) {
        return !d.children;
      });

    var cell = svg.selectAll("g")
      .data(nodes)
      .enter().append("svg:g")
      .attr("class", "cell")
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      })
      .on("click", function(d) {
        return zoom(node == d.parent ? root : d.parent);
      });


    cell.append("svg:rect")
      .attr("width", function(d) {
        return d.dx - 1;
      })
      .attr("height", function(d) {
        return d.dy - 1;
      })
      .style("fill", function(d) {
        return color(d.parent.name);
      });

    cell.append("svg:text")
      .attr("x", function(d) {
        console.log(d.dx);
        return d.dx / 2;
      })
      .attr("y", function(d) {
        console.log(d.dy);
        return d.dy / 2;
      })
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text(function(d) {
        return d.name;
      });
      //.style("opacity", function(d) { d.w = this.getComputedTextLength(); return d.dx > d.w ? 1 : 0; })
      //.call(wrap, 80);


    d3.select(window).on("click", function() {
      zoom(root);
    });

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
      var kx = w / d.dx,
        ky = h / d.dy;
      x.domain([d.x, d.x + d.dx]);
      y.domain([d.y, d.y + d.dy]);

      var t = svg.selectAll("g.cell").transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .attr("transform", function(d) {
          return "translate(" + x(d.x) + "," + y(d.y) + ")";
        });

      t.select("rect")
        .attr("width", function(d) {
          return kx * d.dx - 1;
        })
        .attr("height", function(d) {
          return ky * d.dy - 1;
        })

      t.select("text")
        .attr("x", function(d) {
          return kx * d.dx / 2;
        })
        .attr("y", function(d) {
          return ky * d.dy / 2;
        });
      //.style("opacity", function(d) { return kx * d.dx > d.w ? 1 : 0; });

      node = d;
      d3.event.stopPropagation();
    }

  }

  build_chart(data, div, size, undefined, csv_parser, inline_parser, draw);

}


function simplot(data, div, size) {

  var inline_parser = function(data) {
    //To be written
  }

  var csv_parser = function(data) {

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

    var comp_data = {
      original_data: data,
      grouped_data: processed_data,
      variations: variations,
      simulations: simulations
    };

    return comp_data;

  }

  var draw = function(processed_data, div, size) {

    var glasseye_chart = new GlasseyeChart(div, size, {
      top: 20,
      bottom: 20,
      right: 100,
      left: 20
    });
    glasseye_chart.add_svg();

    var color = d3.scale.category20();

    //Set up the scales
    var x = d3.scale.linear()
      .range([0, glasseye_chart.width])
      .domain([d3.min(processed_data.original_data, function(d) {
        return +d["day"]
      }) - 10, d3.max(processed_data.original_data, function(d) {
        return +d["day"]
      })]);

    var y = d3.scale.linear()
      .range([glasseye_chart.height, 0])
      .domain([d3.min(processed_data.original_data, function(d) {
        return +d['value']
      }), d3.max(processed_data.original_data, function(d) {
        return +d['value']
      })]);

    //Set up the axes
    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickSize(-glasseye_chart.height, 0, 0);

    var yAxis = d3.svg.axis()
      .scale(y)
      .tickSize(-glasseye_chart.width, 0, 0)
      .orient("left");

    var svg = glasseye_chart.chart_area;

    //Add the axes
    svg.append("g")
      .attr("class", "chart_grid")
      .attr("transform", "translate(0," + glasseye_chart.height + ")")
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

    processed_data.grouped_data.forEach(function(v, j) {

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


      path.each(function(d) {
          d.totalLength = this.getTotalLength();
        })
        .attr("stroke-dasharray", function(d) {
          return d.totalLength + " " + d.totalLength;
        })
        .attr("stroke-dashoffset", function(d) {
          return d.totalLength;
        })
        .transition()
        .delay(j * 7000)
        .duration(7000)
        .ease("linear")
        .attr("stroke-dashoffset", 0)
        .transition()
        .duration((processed_data.variations.length - 1 - j) * 7000)
        .attr("stroke-dashoffset", 0)
        .each("end", repeat);


      function repeat() {
        var path = d3.select(this);
        path.attr("stroke-dasharray", function(d) {
            return d.totalLength + " " + d.totalLength;
          })
          .attr("stroke-dashoffset", function(d) {
            return d.totalLength;
          })
          .transition()
          .delay(j * 7000)
          .duration(7000)
          .ease("linear")
          .attr("stroke-dashoffset", 0)
          .transition()
          .duration((processed_data.variations.length - 1 - j) * 7000)
          .attr("stroke-dashoffset", 0)
          .each("end", repeat);
      }


    });


    if (processed_data.variations.length > 1) {

      add_legend(svg, glasseye_chart.width + glasseye_chart.margin.left, glasseye_chart.margin.top, processed_data.variations.map(function(v) {
        return {
          "label": v,
          "colour": color(v)
        }
      }));
    }
  }

  build_chart(data, div, size, undefined, csv_parser, inline_parser, draw);

}

function dot_plot(file, div, size) {

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
        values: data.filter(function(d) {
          return d.group === g
        }).map(function(e) {
          return {
            value: +e.value,
            variable: e.variable
          }
        })
      }
    });


    //This where we add the ordinal scales

    var min_y = d3.min(data, function(d) {
        return +d['value']
      }),
      max_y = d3.max(data, function(d) {
        return +d['value']
      }),
      range_y = max_y - min_y;

    //Work out the ratio of the range of y to max_y

    var range_max_ratio = range_y / max_y;

    var y = d3.scale.linear()
      .range([height, 0]);

    if (range_max_ratio < 0.3) {
      y.domain([min_y - 0.1 * range_y, max_y + 0.1 * range_y]).nice;
    } else {
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
      .tickFormat(function(d) {
        if (d.length > 15) {
          return d.substring(0, 15) + "..";
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
      .attr("transform", "rotate(-90)");

    svg.append("g")
      .attr("class", "chart_grid")
      .call(yAxis);


    //Add the simulation paths for each variation
    processed_data.forEach(function(v, j) {


      svg.selectAll(".dot")
        .data(v.values)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
          return x(d.variable)
        })
        .attr("cy", function(d) {
          return y(d.value)
        })
        .attr("r", 6)
        .attr("fill", function(d) {
          return color(v.group)
        })
        .attr("opacity", 0.5)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);



    });

    if (groups.length > 1) {
      add_legend(svg, width + margin.left, margin.top, groups.map(function(v) {
        return {
          "label": v,
          "colour": color(v)
        }
      }));
    }
  });

  //Put

  //ordinal.rangePoints(interval[, padding])

}
