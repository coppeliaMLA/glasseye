/**
 * Builds an AnimatedVenn object
 * @constructor
 * @param {array} processed_data Data that has been given a structure appropriate to the chart
 * @param {string} div The div in which the chart will be placed
 * @param {string} size The size (one of several preset sizes)
 */

var AnimatedVenn = function(processed_data, div, size) {

  var self = this;

  margin = {
    top: 60,
    bottom: 0,
    left: 5,
    right: 5
  };

  GlasseyeChart.call(self, div, size, margin, 250);

  self.processed_data = processed_data;

  self.venn_chart = venn.VennDiagram()
    .width(self.width)
    .height(self.height);

  self.tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return d3.format(".3n")(d.size);
    });

  self.interactive_text = function(d, existing_text) {

    var text, set_name = d.sets[0],
      set_size = d.size;

    //Get total number
    var all_sets = self.chart_area.selectAll("g")[0];
    var signed = all_sets.map(function(e) {
      if (e.__data__.sets.length == 2) {
        return -e.__data__.size;
      } else {
        return e.__data__.size;
      }
    });

    var total = signed.reduce(add, 0);

    if (d.sets.length == 1) {

      text = set_name + " was in " + uni_format(set_size * 1000) + " households making up " + d3.format(",.1%")(set_size / total) + " of all VOD subscribing households.";

    } else if (d.sets.length == 2) {

      var sub_1 = d.sets[0];
      var sub_2 = d.sets[1];

      //Work out set sizes
      var set_1_size = all_sets.filter(function(d) {
        return d.__data__.sets.length === 1 & d.__data__.sets[0] === sub_1;
      })[0].__data__.size;
      var set_2_size = all_sets.filter(function(d) {
        return d.__data__.sets.length === 1 & d.__data__.sets[0] === sub_2;
      })[0].__data__.size;

      text = "There were " + uni_format(set_size * 1000) + " households that subscribe to both " + sub_1 + " and " + sub_2 + " (" + d3.format(",.1%")(set_size / total) + " of all VOD subscribing households.)";
    } else {

      text = "There were " + uni_format(set_size * 1000) + " households that subscribe to all three. That's " + d3.format(",.1%")(set_size / total) + " of all VOD subscribing households.";

    }

    function add(a, b) {
      return a + b;
    }

    return text;

  };

};

AnimatedVenn.prototype = Object.create(GlasseyeChart.prototype);

/**
 * Adds the SVGs corresponding to the AnimatedVenn object
 *
 * @method
 * @returns {object} The modified AnimatedVenn object
 */

AnimatedVenn.prototype.add_venn = function() {

  var self = this;

  var start_date = new Date("March 31, 2014 00:00:00"); //Hardcoded at the moment - change later

  var filtered_data = self.processed_data.filter(function(d) {
    return d.time.getTime() === start_date.getTime();
  })[0].venns;

  self.chart_area.datum(filtered_data).call(self.venn_chart);

  self.svg.append("text").attr("class", "context")
    .attr("y", 40)
    .attr("x", self.margin.left + self.width / 2)
    .style("text-anchor", "middle")
    .text("In Q1 2014");

  //Add the div for the commentary
  var div = d3.select(self.div).append("div").attr("id", "venn_context");
  div.append("div").attr("id", "commentary").style("font-size", "11px");

  //Add interactivity
  self.chart_area.selectAll("g")
    .on("mouseover", function(d, i) {

      //Set all charts back to no border-box
      self.chart_area.selectAll(".venn-area")
        .selectAll("path")
        .style("stroke-opacity", 0);

      // sort all the areas relative to the current item
      venn.sortAreas(self.chart_area, d);
      var selection = d3.select(this);
      selection.select("path").transition().duration(500)
        .style("stroke-opacity", 1);

      //update the text
      var existing_text = d3.selectAll("#commentary").html();
      d3.selectAll("#commentary").html(self.interactive_text(d, existing_text));

    })
    .on("mouseout", function(d, i) {
      var selection = d3.select(this);
      selection.select("path").transition().duration(500)
        //  .style("fill-opacity", d.sets.length == 1 ? 0.5 : 0)
        .style("stroke-opacity", 0);

    });

  return this;

};

/**
 * Updates the Venn to show the overlaps at a specific time and with a spectific set highlighted. Also changes the commentary.
 * @method
 * @param {date} time The time for which the overlaps should be calculated
 * @param {string} variable The set which should be highlighted
 * @returns {object} The modified AnimatedVenn object
 */

AnimatedVenn.prototype.update_venn = function(time, variable) {

  var self = this;

  var filtered_data = self.processed_data.filter(function(d) {
    return d.time.getTime() === time.getTime();
  })[0].venns;

  self.chart_area.datum(filtered_data).call(self.venn_chart);

  self.chart_area.selectAll(".venn-area")
    .selectAll("path")
    .style("stroke-opacity", 0);

  self.chart_area.selectAll(".venn-sets-" + variable)
    .selectAll("path")
    .style("stroke-opacity", 1);

  d3.selectAll("#commentary").html("");
  self.svg.selectAll(".context").text("In " + quarter_year(time) + " ");

  return this;

};

/**
 * Adds a title to the Venn
 * @method
 * @param {string} title The title to be placed at the top of the Venn
 * @returns {object} The modified AnimatedVenn object
 */

AnimatedVenn.prototype.add_title = function(title) {

  var self = this;
  self.title = title;
  self.svg.append('text').attr("class", "title")
    .text(title)
    .attr("y", 20)
    .attr("x", self.margin.left + self.width / 2)
    .style("text-anchor", "middle");

  return this;

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

};

/**
 * Redraws the Venn (for example after a resize of the div)
 * @method
 * @returns {object} The modified AnimatedVenn object
 */

AnimatedVenn.prototype.redraw_venn = function(title) {

  var self = this;

  //Delete the existing svg and commentary
  d3.select(self.div).selectAll("svg").remove();
  d3.select(self.div).selectAll("#venn_context").remove();

  //Reset the size
  self.set_size();
  self.venn_chart = venn.VennDiagram()
    .width(self.width)
    .height(self.height);

  //Redraw the chart
  self = self.add_svg().add_venn().add_title(self.title, self.subtitle);

};
