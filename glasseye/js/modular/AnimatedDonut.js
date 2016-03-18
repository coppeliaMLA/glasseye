var AnimatedDonut = function(processed_data, div, size) {

  var self = this;

  margin = {
    top: 80,
    bottom: 130,
    left: 30,
    right: 30
  };

  GlasseyeChart.call(self, div, size, margin, 400);

  self.processed_data = processed_data;

  var total_value = d3.sum(processed_data.map(function(d) {
    return d.values[0].value;
  }));

  self.current_total = 1;

  self.tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return   uni_format(d.data.value) + " households"  + "<br>" + d3.format(".1%")(d.data.value/self.current_total) + " of the total";
    });

  var radius = self.width / 2;

  self.arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70);

  self.pie = d3.layout.pie()
    .sort(null)
    .value(function(d) {
      return d.value;
    });

};


AnimatedDonut.prototype = Object.create(GlasseyeChart.prototype);


AnimatedDonut.prototype.add_donut = function() {

  var self = this;

  var svg_donut = self.chart_area.append("g")
    .attr("transform", "translate(" + self.width / 2 + "," + self.height / 2 + ")");

  var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  //Get first Date

  var start_date = d3.min(self.processed_data[0].values.map(function(d) {
    return d.time;
  }));

  //Create filtered data Set

  var filtered_donut = self.processed_data.map(function(d) {
    return {
      category: d.category,
      value: d.values[0].value
    };
  });

  svg_donut.call(self.tip);

  self.donut_arc = svg_donut.selectAll(".arc")
    .data(self.pie(filtered_donut))
    .enter().append("g")
    .attr("class", "arc");

  var existing_text;

  self.donut_path = self.donut_arc.append("path")
    .attr("d", self.arc)
    .attr("class", function(d, i) {
      return ("d_" + i + " " + create_class_label("d", d.data.category));
    })
    .attr("fill", function(d) {
      return color(d.data.category);
    })
    .on('mouseover', function(d, i) {
      /*existing_text  = self.svg.selectAll(".context").text();
      var text_line_1 = existing_text.substring(0, 11) + d3.format("%")(d.data.value/self.current_total) + " of households";
      var text_line_2  = "with " + existing_text.substring(15, existing_text.length);
      var text_line_3  = "are at lifestage " + d.data.group;
      self.svg.selectAll(".context").text(text_line_1);
      self.svg.selectAll(".context_2").text(text_line_2);
      self.svg.selectAll(".context_3").text(text_line_3);
      */
      self.tip.show(d);
    })
    .on('mouseout', function(d, i) {
      //self.svg.selectAll(".context").text(existing_text);
      self.tip.hide(d);
    });


  self.donut_text = self.donut_arc.append("text")
    .attr("transform", function(d) {
      return "translate(" + self.arc.centroid(d) + ")";
    })
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .text(function(d) {
      if (d.endAngle - d.startAngle > 0.35) {
        return d.data.category;
      } else {
        return "";
      }
    });

  self.donut_path.transition()
    .duration(500)
    .attr("fill", function(d, i) {
      return color(d.data.category);
    })
    .attr("d", self.arc)
    .each(function(d) {
      this._current = d;
    });

  self.svg.append("text").attr("class", "context")
    .attr("y", self.height + self.margin.top + 70)
    .attr("x", self.margin.left + self.width / 2)
    .style("text-anchor", "middle");

  /*self.svg.append("text").attr("class", "context_2")
      .attr("y", self.height + self.margin.top + 75)
      .attr("x", self.margin.left + self.width / 2)
      .style("text-anchor", "middle");

  self.svg.append("text").attr("class", "context_3")
      .attr("y", self.height + self.margin.top + 90)
      .attr("x", self.margin.left + self.width / 2)
      .style("text-anchor", "middle");
  */

  self.update_donut(start_date, "No TV");


  return this;

};


AnimatedDonut.prototype.update_donut = function(time, variable) {

  var self = this;

  var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);


  var filtered_donut = self.processed_data.map(function(d) {

    return {

      category: d.category,
      value: d.values.filter(function(e) {
        return (e.time.getTime() === time.getTime() & e.variable === variable);
      })[0].value
    };
  });


  //Update tooltip

  self.current_total = d3.sum(filtered_donut.map(function(d){return d.value}));

  self.donut_path.data(self.pie(filtered_donut)).transition().duration(200).attrTween("d", arcTween);


  self.donut_text.data(self.pie(filtered_donut)).transition().duration(200).attr("transform", function(d) {
      return "translate(" + self.arc.centroid(d) + ")";
    })
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .text(function(d) {
      return d.data.category;
    });

  function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
      return self.arc(i(t));
    };
  }

  self.svg.selectAll(".context").text("In " + quarter_year(time) + " for " + variable);




};

AnimatedDonut.prototype.add_title = function(title, subtitle) {

  var self = this;
  self.title = title;
  self.svg.append('text').attr("class", "title")
    .text(title)
    .attr("y", 20)
    .attr("x", self.margin.left + self.width / 2)
    .style("text-anchor", "middle");

  if (subtitle != undefined) {

    self.subtitle = subtitle;
    self.svg.append('text').attr("class", "subtitle")
        .text(subtitle)
        .attr("y", 35)
        .attr("x", self.margin.left + self.width / 2)
        .style("text-anchor", "middle");

  } else {
    self.subtitle = "";
  }

  return this;

};

AnimatedDonut.prototype.redraw_donut = function(title) {

  var self = this;

  //Delete the existing svg and commentary
  d3.select(self.div).selectAll("svg").remove();
  d3.select(self.div).selectAll("#venn_context").remove();

  //Reset the size
  self.set_size();

  var radius = self.width / 2;

  self.arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70);


  //Redraw the chart
  self.add_svg().add_donut().add_title(self.title, self.subtitle);

};
