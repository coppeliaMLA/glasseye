/**
 * Builds a Heatmap object
 * @constructor
 * @param {array} processed_data Data that has been given a structure appropriate to the chart
 * @param {string} div The div in which the chart will be placed
 * @param {string} size The size (one of several preset sizes)
 * @param {array} [labels] An array of the axis labels
 * @param {array} scales Scales for the x and y axes
 * @param {object} [margin] Optional argument in case the default margin settings need to be overridden
 */

var Heatmap = function (processed_data, div, size, labels, scales, margin) {

    var self = this;

    self.processed_data = processed_data;

    //Work out if there is a need for label rotation
    var x_scale_labels = scales[0].scale_func.domain();
    var max_string = d3.max(x_scale_labels.map(function (d) {
        return d.length;
    }));
    self.num_points = x_scale_labels.length;

    self.rotate_labels = (max_string > 60 / self.num_points) ? true : false;

    if (margin === undefined) {
        margin = {
            top: 50,
            bottom: 20,
            right: 20,
            left: 120
        };
    }

    if (self.rotate_labels === true) {
        margin.bottom = max_string * 5
    }
    ;

    //Creates color scale based on the value field
    color_domain = d3.extent(processed_data.map(function (d) {
        return d.value
    }));

    self.heat_scale = d3.scale.quantile()
        .domain(processed_data.map(function (d) {
            return d.value
        }))
        .range(colorbrewer.RdBu[9].reverse());

    //Create a list of groupspw
    self.groups = [];
    processed_data.map(function (d) {
        if (self.groups.indexOf(d.group) === -1) {
            self.groups.push(d.group);
        }
    });


    GridChart.call(self, div, size, labels, scales, margin);

    //Customise grid
    self.x_axis.tickSize(0);
    self.y_axis.tickSize(0).tickPadding(12);


    //Work out rect dimensions
    self.rect_height = self.height / scales[1].scale_func.domain().length;

    //Redo the x axis so we always get squares
    if (self.width > self.height){
        self.width = self.num_points * self.rect_height;
        self.x = self.scales[0].scale_func.rangePoints([0, self.width], 1);
    }


    self.tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            var text;
            if (d.value> 1){ text = d.group + " penetration is " + d3.format(",.1%")(d.raw_value/100) + "<br>That's " + d3.format(",.1%")(d.value/100) + " up on a national<br>average of " +  d3.format(",.1%")(d.nat_avg/100);}
        else
    {
        text = d.group + " penetration is " + d3.format(",.1%")(d.raw_value/100) + "<br>That's " +d3.format(",.1%")(-1*d.value/100) + " down on a national<br>average of " +  d3.format(",.1%")(d.nat_avg/100);
    }
            return text;
        });

};

Heatmap.prototype = Object.create(GridChart.prototype);


/**
 * Adds the SVGs corresponding to the BarChart object
 *
 * @method
 * @returns {object} The modified BarChart object
 */

Heatmap.prototype.add_heatmap = function () {


    var self = this;
    self.parent_div = d3.select(self.svg.node().parentNode.parentNode);

    self.chart_area.call(self.tip);

    //Get first variable
    var start_variable = self.processed_data[0].group;
    self.store_clicked = start_variable;

    //Filter the data
    var filtered_heatmap = self.processed_data.filter(function (d) {
            return d.group === start_variable
        }
    );

    //Check if we can fit in squares

    self.rect_width = (self.width > self.height)? self.rect_height : (self.width/self.num_points);

    //Add squares
    self.chart_area.selectAll(".heatmap_square")
        .data(filtered_heatmap)
        .enter()
        .append("rect")
        .attr("class", "heatmap_square")
        .attr("x", function (d) {
            return self.x(d.category_x) - self.rect_width / 2;
        })
        .attr("y", function (d) {
            return self.y(d.category_y) - self.rect_height / 2;
        })
        .attr("width", self.rect_width - 5)
        .attr("height", self.rect_height - 5)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("fill", function (d) {
            return self.heat_scale(d.value)
        })
        .on("mouseover", function(d, i) {

            //update the text
            self.parent_div.selectAll("#commentary").html(self.interactive_text(d));
            self.tip.show(d);

        })
        .on('mouseout', self.tip.hide);


    //Rotate labels if necessary
    if (self.rotate_labels === true) {
        self.chart_area.selectAll(".x_axis").selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-1em")
            .attr("dy", "-0.8em")
            .attr("transform", "rotate(-90)");
    }

    //Add the controls
    self.svg.selectAll('.control_label')
        .data(self.groups)
        .enter()
        .append("text")
        .attr("class", "control_label")
        .attr("transform", function (d, i) {
            return "translate(0," + (i * 22 + self.margin.top + 15) + ")"
        })
        .text(function (d) {
            return d;
        })
        .attr("class", function(d) { return (d===start_variable)? "control_label selected":"control_label unselected"})
        .on('mouseover', function (d) {
            self.svg.selectAll('.control_label').attr("class", "control_label unselected");
            d3.select(this).attr("class", "control_label selected");
            self.update_heatmap(d);
        })
        .on('mouseout', function (d) {
            self.svg.selectAll('.control_label').attr("class", function(d) {return (d===self.store_clicked)?"control_label selected":"control_label unselected";});
            self.update_heatmap(self.store_clicked);
        })
        .on('click', function (d) {
            self.svg.selectAll('.control_label').attr("class", "control_label unselected");
            d3.select(this).attr("class", "control_label selected");
            self.update_heatmap(d);
            self.store_clicked = d;
        });

    //Add the div for the commentary
    self.parent_div.selectAll("#heatmap_context_side").remove();
    var div = self.parent_div.append("div").attr("id", "heatmap_context_side");
    div.append("div").attr("id", "venn_instructions").html("<h1> Instructions </h1><ul><li>Hover over the platform providers on the left hand side to change the heatmap.</li><li>Hover over the cells to see a full commentary in space below.</li></ul><h1>Commentary</h1>");
    div.append("div").attr("id", "commentary").html("Hover over a circle and commentary will appear here.");

    //Adjust the x axis label

    self.svg.selectAll(".axis_label_x")
        .attr("class", "axis_label axis_label_x")
        .attr("transform", "translate(" + (self.margin.left + self.num_points * self.rect_height + 10) + ", " + (self.height + self.margin.top - 3) + ") rotate(-90)");

    return self;

};


Heatmap.prototype.add_legend = function () {

    var self = this;

    var square_dim = self.height / 9;

    //Add legend
    var legend = self.svg.append("g")
        .attr("class", "legend")
        .attr("width", 180)
        .attr("height", 400)
        .attr("transform", "translate(" + (self.margin.left + self.height * 1.1) + "," + self.margin.top + ")");

    //Add label

    legend
        .append("text")
        .attr("transform", "translate(-5," + self.height/2 +  ") rotate(-90)")
        .text("% Gain on National Average")
        .attr("text-anchor", "middle")
        .attr("class", "subtitle");

    legend_item = legend.selectAll("legend_item")
        .data(self.heat_scale.range())
        .enter()
        .append("g")
        .attr("class", "legend_item")
        .attr("transform", function (d, i) {
            return ("translate(" + 4 + "," + (self.height - (i + 1) * square_dim) + ")")
        });

    /*legend_item.append("line")
     .attr("x1", square_dim/2+2)
     .attr("x2", square_dim/2 + 6)
     .attr("y1", 0)
     .attr("y2", 0)
     .attr("stroke", "white")
     .style("opacity", function(d, i) {return (i===block)?0:1;});
     */

    legend_item.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", square_dim)
        .attr("width", square_dim / 2)
        .attr("fill", function (d) {
            return d
        });

    //var formatter = uni_format_range(self.heat_scale.domain());
    var formatter =  d3.format(".0f");

    legend_item.append("text")
        .attr("class", "legend_text")
        .attr("x", square_dim * 1.7)
        .attr("y", 17)
        .attr("text-anchor", "middle")
        .text(function (d) {
            var r = self.heat_scale.invertExtent(d);
            return formatter(r[0]) + " to " + formatter(r[1]);
        });


    return self;

}


Heatmap.prototype.update_heatmap = function (group) {

    var self = this;


    //Set variable so that it can be accessed by the tooltip
    //self.current_variable = variable.toLowerCase();

    //Filter the data
    var filtered_heatmap = self.processed_data.filter(function (d) {
            return d.group === group
        }
    );

    self.chart_area.selectAll(".heatmap_square").data(filtered_heatmap)
        .transition()
        .duration(1000)
        .attr("fill", function (d) {
            return (d.value === undefined) ? "black" : self.heat_scale(d.value)
        });


    //self.svg.selectAll(".context").text("In " + quarter_year(time) + " for " + variable);


};

Heatmap.prototype.set_commentary = function(commentary_strings) {

    var self = this;

    self.interactive_text = function(d) {

        function highlight(text){
            return "<span style='font-weight: bold; font-size: 1.2em;color:" + self.heat_scale(d.value) + "'>" + text + "</span>";
        }

        var string_parts = commentary_strings.split("$");
        var text =string_parts[0] + highlight(d3.format(",.1%")(d.raw_value/100)) + string_parts[1] + highlight(d.category_x) + string_parts[2] + highlight(d.category_y) + string_parts[3]+ highlight(d.group) + string_parts[4] + highlight(d3.format(",.1%")(d.value/100)) + string_parts[5] + highlight(d.group) +  string_parts[6] + highlight(d3.format(",.1%")(d.nat_avg/100))
        return text;

    };

    return self;
};

//In Q2 2016 $ of households with $ occupant(s) and a $ social grade had $. That's a % difference from the national average penetration for $ which is $"

/**
 * Redraws the Heatmap (for example after a resize of the div)
 * @method
 * @returns {object} The modified Heatmap object
 */

Heatmap.prototype.redraw_heatmap = function (title) {

    var self = this;

    //Delete the existing svg and commentary
    d3.select(self.div).selectAll("svg").remove();
    self.parent_div.selectAll("#heatmap_context_side").remove();

    //Redo the x axis so we always get squares
    if (self.width > self.height){
        self.width = self.num_points * self.rect_height;

    }
    self.x = self.scales[0].scale_func.rangePoints([0, self.width], 1);

    //Redraw the chart
    self = self.set_size().add_svg().add_grid().add_heatmap().add_legend();

};


/**
 * Creates a heatmap within a div
 *
 * @param {array} data Either the path to a csv file or inline data in glasseye
 * @param {string} div The div in which the chart will be placed
 * @param {string} size The size (one of several preset sizes)
 * @param {array} labels An array containing the labels of the x and y axes
 */


function heatmap(data, div, size) {

    var inline_parser = function (data) {

    };

    var draw = function (processed_data, div, size) {

        var x_values = [],
            y_values = [];


        x_values = processed_data.map(function (d) {
            return d.category_x;
        });

        y_values = processed_data.map(function (d) {
            return d.category_y;
        });

        x_values = [].concat.apply([], y_values);
        y_values = [].concat.apply([], y_values);


        var scales = [create_scale(x_values, d3.scale.ordinal()), create_scale(y_values, d3.scale.ordinal())];


        var glasseye_chart = new Heatmap(processed_data, div, size, ["label", "value"], scales);

        glasseye_chart.add_svg().add_grid().add_heatmap();


    };

    build_chart(data, div, size, undefined, group_label_value_parser, inline_parser, draw);


}
