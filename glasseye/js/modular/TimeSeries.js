/**
 * Builds an TimeSeries object
 * @constructor
 * @param {array} processed_data Data that has been given a structure appropriate to the chart
 * @param {string} div The div in which the chart will be placed
 * @param {string} size The size (one of several preset sizes)
 * @param {array} labels An array containing the labels of the x and y axes
 * @param {object} scales An object describing the x and y scales
 * @param {function} tooltip_function A function that is called when the tooltip is on any of the points on the time series charts)
 */

var TimeSeries = function(processed_data, div, size, labels, scales, tooltip_function) {

  var self = this;

  var margin = {
    top: 50,
    bottom: 80,
    right: 30,
    left: 130
  };

  GridChart.call(self, div, size, undefined, scales, margin);

  self.processed_data = processed_data;
  self.tooltip_function = (tooltip_function===undefined)?function(time, variable){}:tooltip_function;

  //Some customisations
  self.y_axis.ticks(4).tickFormat(uni_format_axis).tickSize(0);
  self.x_axis.tickFormat(d3.time.format("%Y")).ticks(d3.time.month, 1).tickSize(6, 0).tickPadding(10);

  self.tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return quarter_year(d.time) + "<br>" + d.group + "<br>" + ((d.variable==="share")? d3.format(".1%")(d.value): self.tooltip_formtter(d.value));
    });

  //Reorder processed data in order of max value
  //self.processed_data =  self.processed_data.sort(function(a,b){return a.group < b.group});


  //Function to create line path
  self.line = d3.svg.line()
    .x(function(d) {
      return self.x(d.time);
    })
    .y(function(d) {
      return self.y(d.value);
    });

  //Function to create areas
  self.area = d3.svg.area()
    .x(function(d) {
      return self.x(d.time);
    })
    .y0(self.height)
    .y1(function(d) {
      return self.y(d.value);
    });

  //Function to create stacked areas
  self.area_stacked = d3.svg.area()
    .x(function(d) {
      return self.x(d.time);
    })
    .y0(function(d) {
      return self.y(d.y0);
    })
    .y1(function(d) {
      return self.y(d.y0 + d.y);
    });

  //Stacked layout
  self.stack = d3.layout.stack()
    .x(function(d) {
      return d.time;
    })
    .y(function(d) {
      return d.value;
    })
    .values(function(d) {
      return d.values;
    }).order("reverse");



  self.color = d3.scale.ordinal()
      .range(colorbrewer.RdYlBu[self.processed_data.length]);

};

TimeSeries.prototype = Object.create(GridChart.prototype);

/**
 * Adds the SVGs that create the times series graph
 * @method
 * @returns {object} The modified TimeSeries object
 */

TimeSeries.prototype.add_timeseries = function() {

  var self = this;

  self.chart_area.call(self.tip);

  //Filter the data
  self.filtered_data = self.processed_data.map(function(g) {
    return {
      group: g.group,
      values: g.values.filter(function(e) {
        return e.variable === "absolute";
      })
    };
  });


  self.chart_area.selectAll(".groups")
    .data(self.filtered_data)
    .enter()
    .append("path")
    .attr("stroke", function(d) {
      return (self.color(d.group));
    })
    .attr("class", function(d, i) {
      return ("timeseries_line c_" + i + " " + create_class_label("c", d.group));
    })
    .attr("d", function(d) {
      return self.line(d.values);
    });


  //Add the areas
  self.chart_area.selectAll(".timeseries_area")
    .data(self.filtered_data)
    .enter()
    .append("path")
    .attr("class", function(d, i) {
      return ("timeseries_area d_" + i + " " +create_class_label("d", d.group));
    })
    .attr("d", function(d) {
      return self.area(d.values);
    })
    .style("opacity", 0);

  self.create_linepoints("absolute");

  //Structure the x axis
  self.chart_area.selectAll("g.x_axis g.tick line")
    .attr("y2", function(d) {
      var month_no = d.getMonth();
      if (month_no % 12 === 0)
        return 6;
      else if (month_no % 3 === 0)
        return 2;
      else
        return 0;
    });


  var domain_in_days = (self.x.domain()[1] - self.x.domain()[0]) / (24 * 60 * 60 * 1000);

   self.chart_area.selectAll("g.x_axis g.tick text")
    .text(function(d, i) {
      var month_no = d.getMonth();
      if (month_no % 12 === 0) {
        return d3.time.format("%Y")(d);
      }
      else if (month_no % 3 === 0) {

        if (domain_in_days > 1200) {
          return "";
        } else {
          console.log(month_no/3);
          return "Q" + Math.floor(month_no/3);
        }
      } else {
        return "";
      }
    });


    if (typeof self.labels !== "undefined") {
      self.chart_area.append("g")
        .attr("class", "axis_label")
        .attr("transform", "translate(0, " + (self.height + self.margin.top) + ") rotate(-90)")
        .append("text")
        .text(self.labels[0]);
      }

  return this;

};

/**
 * Places transparent circles on the points of the time series so that they can trigger the tooltip
 * @method
 * @param {string} to_variable The variable that will be represented on the y axis
 * @returns {object} The modified TimeSeries object
 */

TimeSeries.prototype.create_linepoints = function(to_variable) {

  var self = this;

  //Create the line point data
  var line_points = self.filtered_data.map(function(d) {

    return (d.values.map(function(e) {
      return {
        time: e.time,
        value: e.value,
        group: d.group,
        variable: e.variable,
        y: e.y,
        y0: e.y0
      };
    }));
  });


  line_points = [].concat.apply([], line_points).filter(function(d) {
    return d !== undefined;
  });

  self.chart_area.selectAll(".line_points")
    .data(line_points)
    .enter()
    .append("g")
    .attr("class", "line_point_group")
    .append("circle")
    .attr("class", "line_points")
    .attr("cx", function(d) {
      return self.x(d.time);
    })
    .attr("cy", function(d) {
      if (to_variable === "share") {
        return self.y(d.y0 + d.y);
      } else {
        return self.y(d.value);
      }
    })
    .attr("r", 10)
    .on('mouseover', function(d) {
      self.tooltip_function(d.time, d.group);
      self.tip.show(d);
    })
    .on('mouseout', self.tip.hide);

};


/**
 * Changes the variable mapped to the y axis
 * @method
 * @param {string} to_variable The variable that will be represented on the y axis
 * @param {int} duration Duration of the transformation in milliseconds
 * @returns {object} The modified TimeSeries object
 */

TimeSeries.prototype.flip_variable = function(to_variable, duration) {

  var self = this;
  self.current_y_axis = to_variable;

  duration = (duration === undefined)? 1000: duration;

  //Filter the data
  self.filtered_data = self.processed_data.map(function(g) {
    return {
      group: g.group,
      values: g.values.filter(function(e) {
        return e.variable === to_variable;
      })
    };
  });

  //Update y axis
  self.y.domain(minmax_across_groups(self.processed_data, to_variable));

  //Some defaults
  var select_area = self.area;
  var area_opacity = 0;

  if (to_variable === "absolute") {

    self.y_axis.tickFormat(uni_format_axis).ticks(6);


  } else if (to_variable === "share") {

    self.y_axis.tickFormat(d3.format("0%")).ticks(6);
    self.filtered_data = self.stack(self.filtered_data);
    self.y.domain([0, 1]);
    select_area = self.area_stacked;
    area_opacity = 1;

  } else {
    self.y_axis.tickFormat(d3.format(".2n")).ticks(6);
  }

  self.chart_area.selectAll(".y_axis")
    .call(self.y_axis);

  //Update paths
  self.chart_area.selectAll(".timeseries_line")
    .data(self.filtered_data)
    .transition()
    .duration(duration)
    .attr("d", function(d) {
      if (to_variable === "share") {
        return self.line(d.values.map(function(e) {
            return {
              time: e.time,
              value: (e.y + e.y0)
            };
        }));
      } else {
        return self.line(d.values);
      }
    });

  self.chart_area.selectAll(".timeseries_area")
    .data(self.filtered_data)
    .transition()
    .duration(duration)
    .attr("d", function(d) {
      return select_area(d.values);
    })
    .style("opacity", area_opacity);


  //Update points
  self.chart_area.selectAll('.line_points').remove();

  //Create the line point data
  self.create_linepoints(to_variable);

  self.update_line_labels(to_variable);

  return this;

};

/**
 * Adds a legend to the TimeSeries object
 * @method
 * @returns {object} The modified TimeSeries object
 */

TimeSeries.prototype.add_legend = function() {

  var self = this;


  if (self.processed_data.length > 1) {
    add_legend(self.svg, 0, self.margin.top, self.processed_data.map(function(v, i) {
      return {
        "label": v.group,
        "colour": self.color(v.group),
        "class": create_class_label("d", v.group)
      };
    }));
  }

  return this;

};

/**
 * Adds a label to the TimeSeries object
 * @method
 * @param {string} title The title to be placed at the top of the chart
 * @returns {object} The modified TimeSeries object
 */

TimeSeries.prototype.add_title = function(title, subtitle) {

  var self = this;
  self.title = title;
  self.svg.append('text').attr("class", "title")
    .text(title)
    .attr("transform", "translate(" + (self.margin.left - 10) + ",20)");

  if (subtitle != undefined) {

    self.subtitle = subtitle;
    self.svg.append('text').attr("class", "subtitle")
        .text(subtitle)
        .attr("transform", "translate(" + (self.margin.left - 10) + ",35)");

  }

  return this;

};

/**
 * Adds labels at the end of each line (as an alretantive to having a legend)
 * @method
 * @returns {object} The modified TimeSeries object
 */

TimeSeries.prototype.add_line_labels = function() {

  var self = this;

  self.chart_area.attr("transform", "translate(50,50)");

  var end_point = self.x.domain()[1].getTime();

  var end_point_data = self.processed_data.map(function(d){
    return {
      group: d.group,
      value: d.values.filter(function(e) { return e.time.getTime()===end_point && e.variable==="absolute";})[0].value
    };
  });

  self.chart_area.selectAll(".line_labels")
  .data(end_point_data)
  .enter()
  .append("text")
  .attr("class", "line_labels")
  .attr("x", self.width+10)
  .attr("y", function(d){return self.y(d.value);})
  .text(function(d){return d.group;});

  return this;

};

/**
 * Updates the labels of the lines as they move
 * @method
 * @returns {object} The modified TimeSeries object
 */

TimeSeries.prototype.update_line_labels = function(variable) {

  var self = this;

  var end_point = self.x.domain()[1].getTime();

  var end_point_data = self.processed_data.map(function(d){
    return {
      group: d.group,
      value: d.values.filter(function(e) { return e.time.getTime()===end_point && e.variable===variable;})[0].value
    };
  });


  self.chart_area.selectAll(".line_labels")
  .transition()
  .duration(1000)
  .attr("y", function(d, i){return self.y(end_point_data[i].value);});

};

/**
 * Redraws the time series (for example after a resize of the div)
 * @method
 * @returns {object} The modified TimeSeries object
 */

TimeSeries.prototype.redraw_timeseries = function(title) {

  var self = this;

  //Delete the existing svg and commentary
  d3.select(self.div).selectAll("svg").remove();

  //Reset the size
  self.set_size();

  if (self.scales[0].scale_type === "ordinal") {
    self.x = self.scales[0].scale_func.rangePoints([0, self.width], 1);
  } else {
    self.x = self.scales[0].scale_func.range([0, self.width]);
  }

    //Commented out as it seemed to be affecting the tick marks and I con't remember what it does!
    //self.x_axis = d3.svg.axis()
    //  .scale(self.x);


  var current_y_axis = (self.current_y_axis === undefined) ? "absolute": self.current_y_axis;

  self.y.domain(minmax_across_groups(self.processed_data, current_y_axis));

  //Redraw the chart
  self.add_svg().add_grid().add_timeseries().add_legend().add_title(self.title, self.subtitle).flip_variable(current_y_axis, 0);

};


/**
 * Builds a TimeSeries object
 * @param {array} data Either the path to a csv file or inline data in glasseye
 * @param {string} div The div in which the chart will be placed
 * @param {string} size The size (one of several preset sizes)
 * @param {array} labels An array containing the labels of the x and y axes
 */


function timeseries(data, div, size, labels) {


  var inline_parser = function(data) {

    return data;

  };

  var csv_parser = function(data) {

    //Read in the different groups
    var groups = [];
    data.map(function(d) {
      if (groups.indexOf(d.group) === -1) {
        groups.push(d.group);
      }
    });


    //Try some date formats
    var parse_date= d3.time.format("%d/%m/%Y").parse;

    //Create the json data from the csv data
    var processed_data = groups.map(function(g) {

      return {
        group: g,
        values: data.filter(function(d) {
          return d.group === g;
        }).map(function(e) {
          return {
            value: +e.value,
            time: parse_date(e.time),
            variable: e.variable
          };
        })
      };
    });

    return processed_data;

  };

  var draw = function draw_timeseries(processed_data, div, size, labels) {

    var x_values = [],
      y_values = [];

    x_values = processed_data.map(function(d) {
      return (d.values.map(function(e) {
        return e.time;
      }));
    });
    x_values = [].concat.apply([], x_values);

    y_values = processed_data.map(function(d) {
      return (d.values.map(function(e) {
        return e.value;
      }));
    });
    y_values = [].concat.apply([], y_values);

    var tooltip_function = function(time, variable) {

    }

    var scales = [create_scale(x_values, d3.time.scale()), create_scale(y_values, d3.scale.linear())];
    var glasseye_chart = new TimeSeries(processed_data, div, size, labels, scales, tooltip_function);

    glasseye_chart.add_svg().add_grid().add_timeseries().add_legend();

  };

  build_chart(data, div, size, labels, csv_parser, inline_parser, draw);

}
