/**
 * Builds a BarChart object
 * @constructor
 * @param {array} processed_data Data that has been given a structure appropriate to the chart
 * @param {string} div The div in which the chart will be placed
 * @param {string} size The size (one of several preset sizes)
 * @param {array} [labels] An array of the axis labels
 * @param {array} scales Scales for the x and y axes
 * @param {object} [margin] Optional argument in case the default margin settings need to be overridden
 */

var BarChart = function (processed_data, div, size, labels, scales, margin) {

    var self = this;

    self.processed_data = processed_data;

    self.type = (self.processed_data[0].group === undefined) ? "simple" : "group";

    //Work out if there is a need for label rotation

    var x_scale_labels = scales[0].scale_func.domain();
    var max_string = d3.max(x_scale_labels.map(function (d) {
        return d.length;
    }));
    var num_points = x_scale_labels.length;

    self.rotate_labels = (max_string > 60 / num_points)? true: false;

    if (margin === undefined) {
        margin = {
            top: 20,
            bottom: 30,
            right: 20,
            left: 40
        };
    }

    if (self.rotate_labels === true) {margin.bottom = max_string*5};

    if (self.type === "group") {
        margin.right = 80;

        self.loose_bars = self.processed_data.map(function (d) {

            return (d.values.map(function (e) {
                return {
                    value: e.value,
                    group: d.group,
                    label: e.label,
                    y0: e.y0,
                    y1: e.y1
                };
            }));
        });


        self.loose_bars = [].concat.apply([], self.loose_bars).filter(function (d) {
            return d !== undefined;
        });


        //Section to work out the number of labels
        self.legend_labels = [];

        self.loose_bars.forEach(function (d) {
            if (self.legend_labels.indexOf(d.label) === -1) {
                self.legend_labels.push(d.label);
            }
        });

        self.num_labels = self.legend_labels.length;

        self.color = d3.scale.ordinal()
            .range(colorbrewer.RdBu[self.num_labels]);
    }

    GridChart.call(self, div, size, labels, scales, margin);

    //Some customisations
    //self.margin.left = 4;
    //self.y_axis.tickFormat("");

    self.tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            var text = (self.type === "simple") ? uni_format(d.value) : d.label + "<br> size: " + uni_format(d.value);
            return text;
        });

    self.bar_width = self.width / processed_data.length;

};

BarChart.prototype = Object.create(GridChart.prototype);


/**
 * Adds the SVGs corresponding to the BarChart object
 *
 * @method
 * @returns {object} The modified BarChart object
 */

BarChart.prototype.add_bars = function () {

    var self = this;

    self.chart_area.call(self.tip);

    if (self.type === "simple") {

        self.chart_area.selectAll(".bar")
            .data(self.processed_data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
                return self.x(d.label) - self.bar_width / 4;
            })
            .attr("y", function (d) {
                return self.y(d.value);
            })
            .attr("width", self.bar_width / 2)
            .attr("height", function (d) {
                return self.height - self.y(d.value);
            })
            .on('mouseover', self.tip.show)
            .on('mouseout', self.tip.hide);

    } else {

        self.chart_area.selectAll(".bar")
            .data(self.loose_bars)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
                return self.x(d.group) - self.bar_width / 4;
            })
            .attr("y", function (d) {
                return self.y(d.y1);
            })
            .attr("width", self.bar_width / 2)
            .attr("height", function (d) {
                return self.y(d.y0) - self.y(d.y1);
            })
            .on('mouseover', self.tip.show)
            .on('mouseout', self.tip.hide)
            .on('click', function () {
                self.change_layout("to_side");
            })
            .style("fill", function (d) {
                return self.color(d.label);
            });

        //Add the legend
        add_legend(self.svg, self.margin.left + self.width + 20, self.margin.top, self.legend_labels.map(function (v, i) {
            return {
                "label": v,
                "colour": self.color(v),
                "class": "d_" + i
            };
        }).reverse());

    }

    //Rotate labels if necessary

    if (self.rotate_labels === true) {
        self.chart_area.selectAll(".x_axis").selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-1em")
            .attr("dy", "-0.8em")
            .attr("transform", "rotate(-90)");
    }

    //Prune the y axis tick labels

    var tick_labels = self.chart_area.selectAll(".y_axis").selectAll("text");
    var ticks_even = +(tick_labels[0].length % 2 === 0);
    tick_labels.style("opacity", function (d, i) {
        return (i % 2 === ticks_even) ? 1 : 0;
    });

    return self;

};

/**
 * Changes a grouped barchart from stacked to side by side and vice versa.
 *
 * @method
 * @returns {object} The modified BarChart object
 */

BarChart.prototype.change_layout = function (direction) {

    var self = this;

    if (direction === "to_side") {

        //Adjust the y axis

        self.preserved_domain = self.y.domain();
        var max_to_side = 0;
        self.processed_data.forEach(function (d) {
            d.values.forEach(function (e) {
                max_to_side = (e.value > max_to_side) ? e.value : max_to_side;
            })
        });
        self.y.domain([self.preserved_domain[0], max_to_side]);
        self.chart_area.selectAll(".y_axis").transition()
            .duration(1000)
            .call(self.y_axis);

        //Prune the y axis tick labels
        var tick_labels = self.chart_area.selectAll(".y_axis").selectAll("text");
        var ticks_even = +(tick_labels[0].length % 2 === 0);
        tick_labels.style("opacity", function (d, i) {
            return (i % 2 === ticks_even) ? 1 : 0;
        });


        self.chart_area.selectAll(".bar")
            .on('click', function () {
                self.change_layout("to_stack");
            })
            .transition()
            .duration(1000)
            .attr("width", self.bar_width * 0.8 / self.num_labels)
            .attr("y", function (d) {
                return self.y(d.value);
            })
            .attr("height", function (d) {
                return self.y(d.y0) - self.y(d.y1);
            })
            .attr("x", function (d) {
                var j = self.legend_labels.indexOf(d.label);
                return self.x(d.group) + j * (self.bar_width * 0.8 / self.num_labels) - self.bar_width * 0.5 + self.bar_width * 0.1;
            });


    } else {

        self.y.domain(self.preserved_domain);
        self.chart_area.selectAll(".y_axis").transition()
            .duration(1000)
            .call(self.y_axis);

        //Prune the y axis tick labels
        var tick_labels = self.chart_area.selectAll(".y_axis").selectAll("text");
        var ticks_even = +(tick_labels[0].length % 2 === 0);
        tick_labels.style("opacity", function (d, i) {
            return (i % 2 === ticks_even) ? 1 : 0;
        });

        self.chart_area.selectAll(".bar")
            .on('click', function () {
                self.change_layout("to_side");
            })
            .transition()
            .duration(1000)
            .attr("x", function (d) {
                return self.x(d.group) - self.bar_width / 4;
            })
            .attr("y", function (d) {
                return self.y(d.y1);
            })
            .attr("width", self.bar_width / 2)
            .attr("height", function (d) {
                return self.y(d.y0) - self.y(d.y1);
            });


    }


};

/**
 * Allows the used to see which differences are significant
 *
 * @method
 * @returns {object} The modified BarChart object
 */

BarChart.prototype.grumpy = function (method) {

    var self = this;

    if (self.type === "simple") {

        //Add the commentary div;

        d3.selectAll(self.div).append("div").attr("id", "commentary").style("width", self.width + "px").style("margin-left", self.margin.left + "px");

        var bar_values = self.processed_data.map(function (d) {
            return d.value
        });
        var bar_labels = self.processed_data.map(function (d) {
            return d.label
        });
        var sum_values = d3.sum(bar_values);

        if (method === "bayesian") {

            var alphas = bar_values.map(function (d) {
                return d + 1
            });

            //Work out shrunk means
            var sum_alphas = d3.sum(alphas);

            var shrunk_means = alphas.map(function (d) {
                return sum_values * d / sum_alphas;
            });

            //Generate draws from the posterior distribution
            var draw = random_dirichlet(alphas);
            var sample = [];

            for (var i = 0; i < 5000; i = i + 1) {
                sample.push(draw())
            }
            ;

            var comparisons = [];

            bar_labels.forEach(function (d, i) {
                bar_labels.forEach(function (e, j) {
                    comparisons.push(
                        {
                            A: i, B: j, A_label: d, B_label: e,
                            diff_dist: sample.map(function (f) {
                                return f[i] - f[j];
                            }),
                        })
                })

            });

            self.comparisons = comparisons.map(function (d) {
                return {
                    A: d.A, B: d.B, A_label: d.A_label, B_label: d.B_label,
                    diff_dist: d.diff_dist,
                    less_than_zero: d3.sum(d.diff_dist.map(function (e) {
                        return (e < 0) ? 1 : 0;
                    })) / 5000,
                    more_than_zero: d3.sum(d.diff_dist.map(function (e) {
                        return (e < 0) ? 0 : 1;
                    })) / 5000
                }
            })


            //Shadows for shrunken means
            shrunk_means = shrunk_means.map(function (d, i) {
                return {
                    label: bar_labels[i],
                    value: d
                };
            });


            self.chart_area.insert("g", "rect").selectAll(".bar_shrunk")
                .data(shrunk_means)
                .enter()
                .append("rect")
                .attr("class", "bar_shrunk")
                .attr("x", function (d) {
                    return self.x(d.label) - self.bar_width / 4 + 15;
                })
                .attr("y", function (d) {
                    return self.y(d.value);
                })
                .attr("width", self.bar_width / 2)
                .attr("height", function (d) {
                    return self.height - self.y(d.value);
                })
                .style("fill", "steelblue")
                .style("opacity", 0.2);


            //Click to show differences

            self.select_mode = 0;

            self.posterior_diff = function (d, i) {


                if (self.select_mode === 0) {
                    self.select_mode = 1;
                    self.A = i;
                }

                else if (self.select_mode === 1) {
                    self.select_mode = 2;
                    self.B = i;
                    console.log(self.comparisons);
                    var diff = self.comparisons.filter(function (f) {
                        return f.A === self.A & f.B === self.B;
                    })[0];


                    d3.selectAll(self.div).selectAll("#commentary").html("Assuming that data sampling was random, there is a " + d3.format("%")(diff.more_than_zero) + " probability that the number of " + diff.A_label + " in the population is greater that the number of " + diff.B_label);
                }

                else {
                    console.log("ok");
                }

            };


            self.chart_area.selectAll(".bar")
                .on('click', function (d, i) {
                    if (self.select_mode === 2) {
                        self.chart_area.selectAll(".bar").style("fill", 'steelblue');
                        self.select_mode = 0;
                    }
                    d3.select(this).style("fill", '#2b506e');
                    self.posterior_diff(d, i);
                })


            /*
             .on('mouseover', function(d){
             self.tip.show(d);
             d3.selectAll(".bar_shrunk").style("opacity", 0.2);
             })
             .on('mouseout', function(d){
             self.tip.show(d);
             d3.selectAll(".bar_shrunk").style("opacity", 0);
             });
             */


        }

    }


}


/**
 * Creates a barchart within a div
 *
 * @param {array} data Either the path to a csv file or inline data in glasseye
 * @param {string} div The div in which the chart will be placed
 * @param {string} size The size (one of several preset sizes)
 * @param {array} labels An array containing the labels of the x and y axes
 */


function barchart(data, div, size) {

    var inline_parser = function (data) {

        processed_data = [];

        for (i = 0; i < data.value.length; i++) {
            data_item = {
                "label": data.label[i],
                "value": +data.value[i]
            };
            processed_data.push(data_item);

        }
        return processed_data;

    };

    var draw = function (processed_data, div, size) {

        var x_values = [],
            y_values = [];

        if (processed_data[0].group === undefined) {

            x_values = processed_data.map(function (d) {
                return d.label;
            });
            y_values = processed_data.map(function (d) {
                return d.value;
            });

        } else {

            x_values = processed_data.map(function (d) {
                return d.group;
            });

            y_values = processed_data.map(function (d) {
                return (d.values.map(function (e) {
                    return e.y1;
                }));
            });
            y_values = [].concat.apply([], y_values);

        }


        var scales = [create_scale(x_values, d3.scale.ordinal()), create_scale(y_values, d3.scale.linear())];


        var glasseye_chart = new BarChart(processed_data, div, size, ["label", "value"], scales);

        glasseye_chart.add_svg().add_grid().add_bars().grumpy("bayesian");


    };

    build_chart(data, div, size, undefined, group_label_value_parser, inline_parser, draw);


}
