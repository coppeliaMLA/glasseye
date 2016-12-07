var AnimatedBarChart = function (processed_data, div, size, labels, scales) {

    var self = this;

    var margin = {
        top: 50,
        bottom: 80,
        right: 50,
        left: 60
    };

    BarChart.call(self, processed_data, div, size, labels, scales, margin);
    self.bar_width = self.width / self.processed_data.length;
    self.y_axis.tickFormat(d3.format(",%")).ticks(6);
    this.x_axis.tickSize(0);

    self.current_variable = "";

    self.tooltip_text = function (d) {
        return d3.format(".1%")(d.value) + " of " + d.category + " have access to a " + self.current_variable;
    }

    self.tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(self.tooltip_text);

};

AnimatedBarChart.prototype = Object.create(BarChart.prototype);

AnimatedBarChart.prototype.add_bars = function () {

    var self = this;

    self.chart_area.call(self.tip);

    //Customisations
    self.svg.attr("class", "glasseye_chart animated_barchart");

    //Get first Date
    var start_date = d3.min(self.processed_data[0].values.map(function(d) {
        return d.time;
    }));

    //Get first variable
    var start_variable = d3.min(self.processed_data[0].values.map(function(d) {
        return d.variable;
    }));

    var bars = self.chart_area.selectAll(".bar")
        .data(self.processed_data)
        .enter()
        .append("g")
        .attr("transform", function (d) {
            return "translate(" + (self.x(d.category) - self.bar_width * 0.4) + ", " + 0 + ")";
        });

    bars.append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("y", function (d) {
            return self.y(d.values[0].value);
        })
        .attr("width", self.bar_width * 0.8)
        .attr("height", function (d) {
            return self.height - self.y(d.values[0].value);
        })
        .on('mouseover', self.tip.show)
        .on('mouseout', self.tip.hide);
    ;

    self.svg.append("text").attr("class", "context")
        .attr("y", self.height + self.margin.top + 60)
        .attr("x", self.margin.left + self.width / 2)
        .style("text-anchor", "middle")
        .text("At " + quarter_year(self.processed_data[0].values[0].time) + " for " + self.processed_data[0].values[0].variable);

    var max_string = d3.max(self.x.domain().map(function (d) {
        return d.length;
    }));
    var num_points = self.x.domain().length;

    if ((max_string * 5) > (1.5 * self.bar_width)) {
        self.chart_area.selectAll(".x_axis").selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-1em")
            .attr("dy", "-0.8em")
            .attr("transform", "rotate(-90)");
    }


    self.update_bars(start_date, start_variable);

    return this;

};


AnimatedBarChart.prototype.update_bars = function (time, variable) {

    var self = this;


    //Set variable so that it can be accessed by the tooltip
    self.current_variable = variable.toLowerCase();

    var filtered_bars = self.processed_data.map(function(d) {
        return {

            category: d.category,
            value: d.values.filter(function(e) {
                return (e.time.getTime() === time.getTime() & e.variable === variable);
            })[0].value
        };
    });

    self.chart_area.selectAll(".bar").data(filtered_bars)
     .transition()
     .duration(500)
     .attr("y", function (d){return self.y(d.value);})
     .attr("height", function (d){return self.height - self.y(d.value);});


    self.svg.selectAll(".context").text("In " + quarter_year(time) + " for " + variable);


};

AnimatedBarChart.prototype.add_title = function (title, subtitle) {

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

    } else {
        self.subtitle = "";
    }

    return this;

};

AnimatedBarChart.prototype.redraw_barchart = function (title) {

    var self = this;

    //Delete the existing svg and commentary
    d3.select(self.div).selectAll("svg").remove();


    //Reset the size
    self.set_size();
    self.bar_width = self.width / self.processed_data.length;
    self.x = self.scales[0].scale_func.rangePoints([0, self.width], 1);
    self.y_axis = d3.svg.axis()
        .scale(self.y)
        .orient("left")
        .tickSize(-self.width, 0, 0)
        .tickFormat(d3.format("%")).ticks(6);


    //Redraw the chart
    self.add_svg().add_grid().add_bars().add_title(self.title, self.subtitle);

};


