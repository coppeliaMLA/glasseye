var Dial = function(processed_data, div, size, scales) {

  //Store arguments
  this.processed_data = processed_data;

  //Default parameters
  var pct_of_width = 0.55;

  //Inherit any attributes or functions of a parent class
  GlasseyeChart.call(this, div, size);

  //Any overides of parent attributes

  //Derive further attributes
  var dial_domain = scales[0].scale_func.domain();
  this.dial_radius = pct_of_width * this.width / 2;

  //Create functions or closures to be used in methods
  this.dial_scale = scales[0].scale_func.range([0, 359]);

  //Temp overide of range
  this.dial_scale.domain([-0.3, 0.1]).clamp(true);

  this.current_angle = this.dial_scale(-0.123);

  //Create the dial face data

  var angles = d3.range(0, 360, 30);

  var local_scale = this.dial_scale;

  this.dial_face_data = angles.map(function(d) {
    return {
      angle: d,
      value: local_scale.invert((d+180) % 360)
    };
  });

};

//Methods for the class. This is where svgs are created

//Inherit methods from parent
Dial.prototype = Object.create(GlasseyeChart.prototype);

//Method for adding svgs
Dial.prototype.add_dial = function() {

  //Store this locally so that it can reference in further functions
  var self = this;

  //Draw the chart
  var face = self.chart_area.append("g")
    .attr("transform", "translate(" + (self.width / 2) + ", " + (self.height / 2.5) + ")");

  face.append("svg").attr("width", self.dial_radius).attr("height", self.dial_radius).append("circle").attr("r", self.dial_radius).style("fill", "#990000");

  face.append("circle")
    .attr("class", "dial_face")
    .attr("r", self.dial_radius);

  face.append("circle")
      .attr("class", "dial_seg")
      .attr("r", self.dial_radius * 0.4)
      .attr("fill", "black");

  face.append("circle")
    .attr("class", "dial_centre")
    .attr("r", self.dial_radius * 0.05);

  function rotate_tween() {
    var i = d3.interpolate(0, self.current_angle);
    return function(t) {
      return "rotate(" + i(t) + ")";
    };
  }

  face.append("line")
    .attr("class", "dial_hand")
    .attr("x2", self.dial_radius * 0.7)
    .transition()
    .duration(this.current_angle / 360 * 5000)
    .attrTween("transform", rotate_tween);

  //Add ticks
  var dial_ticks = face.selectAll(".dial_ticks")
    .data(self.dial_face_data)
    .enter().append("g")
    .attr("transform", function(d) {
      return "rotate(" + d.angle + ") translate(" + -self.dial_radius + ", 0) ";
    });

  dial_ticks.append("line")
    .attr("x2", 7);

  dial_ticks.append("text")
  .style("text-anchor", "middle")
  .attr("class", "dial_tick_labels")
    .attr("dy", ".35em")
    .attr("transform", function(d) {
      return d.angle < 270 && d.angle > 90 ? "translate(20,0) rotate(-90) " : "translate(20,0) rotate(-90) ";
    })
    .text(function(d) {
      return d3.format(",.0f")(d.value*100);
    });

  //Add the counter

  self.chart_area.append("text")
  .attr("class", "dial_counter")
  .attr("transform", "translate(250," + (self.height / 2.5 +7) + ")")
  .text("")
  .style("text-anchor", "end")
  .transition()
  .delay(this.current_angle / 360 * 5000)
  .text("0%");


  //Return the object so that we can use chaining
  return self;

};


//Method for updating svgs
Dial.prototype.update_dial = function(group, variable) {

  //Store this locally so that it can reference in further functions
  var self = this;

  //If necessary filter the data
  var filtered_data = self.processed_data.filter(function(d) {
      return d.group === group;
    })[0].values
    .filter(function(e) {
      return e.variable === variable;
    })[0];

  //Update the chart
  var angle = self.dial_scale(filtered_data.value);
  var local_angle = self.current_angle;

  function rotate_tween() {
    var i = d3.interpolate(local_angle, angle);
    return function(t) {
      return "rotate(" + i(t) + ")";
    };
  }

  self.chart_area.selectAll(".dial_hand")
    .transition()
    .duration(1000)
    .attrTween("transform", rotate_tween);

  //Update the counter

  self.chart_area.selectAll(".dial_counter")
  .transition()
  .delay(1000)
  .text(d3.format("%")(filtered_data.value));

  //Return the object so that we can use chaining
  self.current_angle = angle;
  return self;

};


Dial.prototype.add_title = function(title) {

  var self = this;
  self.svg.append('text').attr("class", "title")
    .text(title)
    .style("text-anchor", "middle")
    .attr("transform", "translate(" + (self.margin.left + self.width/2) + ",20)");

  return this;

};


Dial.prototype.add_subtitle = function(subtitle) {

  var self = this;
  self.svg.append('text').attr("class", "subtitle")
    .text(subtitle)
    .style("text-anchor", "middle")
    .attr("transform", "translate(" + (self.margin.left + self.width/2) + ",40)");

  return this;

};

//wrapper function to process the data and draw the chart

/*

function x_chart(data, div, size) {

  //Define data parsers
  var inline_parser = function(data) {

    return processed_data;

  };

  var csv_parser = function(data) {

    return processed_data;

  };

  //Create draw function
  var draw = function(processed_data, div, size) {

    //Calculate values for scales

    //Create scales

    //Create new chart and chain methods

    var glasseye_chart = new XChart(processed_data, div, size);

    glasseye_chart.add_svg();

  };

  //Function that builds the chart based on whether the data is inline or from a file
  build_chart(data, div, size, undefined, csv_parser, inline_parser, draw);

}
*/
