/**
 * Builds an DrillableVenn object
 * @constructor
 * @param {array} processed_data Data that has been given a structure appropriate to the chart
 * @param {string} div The div in which the chart will be placed
 * @param {string} size The size (one of several preset sizes)
 */

var DrillableVenn = function (processed_data, div, size) {

    var self = this;

    margin = {
        top: 40,
        bottom: 0,
        left: 5,
        right: 5
    };

    GlasseyeChart.call(self, div, size, margin, 350);

    self.processed_data = processed_data;

    self.venn_chart = venn.VennDiagram()
        .width(self.width)
        .height(self.height);

    self.tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return d3.format(".3n")(d.size);
        });

    self.current_level = "none";

    self.interactive_text = function (d, existing_text) {

        var text, set_name = d.sets[0],
            set_size = d.size;

        var qualifier = +(self.current_level === "none") ? "" : self.current_level;

        //Get total number
        var all_sets = self.chart_area.selectAll("g")[0].filter(function(d){return d.__data__.sets[0] != "500k"});
        console.log(all_sets);
        var signed = all_sets.map(function (e) {
            if (e.__data__.sets.length == 2) {
                return -e.__data__.size;
            } else {
                return e.__data__.size;
            }
        });

        var total = signed.reduce(add, 0);

        if (set_name === "500k") {

            text = "This circle represents 500k households and can be used as reference point when the Venn diagrams change in scale.";

        }

        else if (d.sets.length == 1) {

            text = set_name + " consoles are in " + uni_format(set_size) + " households, making up " + d3.format(",.1%")(set_size / total) + " of all households with " + qualifier + " games consoles.";

        } else if (d.sets.length == 2) {

            var sub_1 = d.sets[0];
            var sub_2 = d.sets[1];

            //Work out set sizes
            var set_1_size = all_sets.filter(function (d) {
                return d.__data__.sets.length === 1 & d.__data__.sets[0] === sub_1;
            })[0].__data__.size;
            var set_2_size = all_sets.filter(function (d) {
                return d.__data__.sets.length === 1 & d.__data__.sets[0] === sub_2;
            })[0].__data__.size;

            text = "There are " + uni_format(set_size) + " households that have both " + sub_1 + " and " + sub_2 + " consoles (" + d3.format(",.1%")(set_size / total) + " of all households with " + qualifier + " games consoles.)";
        } else {

            text = "There are " + uni_format(set_size) + " households that own all three types of consoles. That's " + d3.format(",.1%")(set_size / total) + " of all households with " + qualifier + " games consoles.";

        }

        function add(a, b) {
            return a + b;
        }

        return text;

    };

};

DrillableVenn.prototype = Object.create(GlasseyeChart.prototype);

/**
 * Adds the SVGs corresponding to the DrillableVenn object
 *
 * @method
 * @returns {object} The modified DrillableVenn object
 */

DrillableVenn.prototype.add_venn = function (parent) {

    var self = this;

    self.current_level = parent;

    var filtered_data = self.processed_data.filter(function (d) {
        return d.parent === parent;
    })[0].venns;


    self.chart_area.datum(filtered_data).call(self.venn_chart);

    d3.selectAll(".venn-area text").style("fill", "white");

    //Add the div for the commentary
    var parent_div = d3.selectAll("#chart_container");
    parent_div.selectAll("#venn_context_side").remove();

    var div = parent_div.append("div").attr("id", "venn_context_side");
    div.append("div").attr("id", "venn_instructions").html("<h1> Instructions </h1><ul><li>Click on each circle in the Venn diagram to drill a level further into the data.</li><li>Click again on a circle to return to  the top level.</li><li>The scale of the diagram is adjusted as you drill into the data however there is always a circle showing 500k households as a point of reference.</li></ul><h1>Commentary</h1>");
    div.append("div").attr("id", "commentary").html("Hover over a circle and commentary will appear here.");

    //Add interactivity
    self.chart_area.selectAll("g")
        .on("mouseover", function (d, i) {

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
        .on("mouseout", function (d, i) {
            var selection = d3.select(this);
            selection.select("path").transition().duration(500)
                //  .style("fill-opacity", d.sets.length == 1 ? 0.5 : 0)
                .style("stroke-opacity", 0);

        })
        .on("click", function (d, i) {
            var selection = d3.select(this);

            if (parent == "none") {

                if (d.sets.length > 1) {
                    console.log("Cannot click on intersections");
                }
                else {
                    self.add_venn(d.sets[0]);
                }
            }
            else {
                self.add_venn("none");
            }
        });


    //}

    return self;

};


/**
 * Adds a title to the Venn
 * @method
 * @param {string} title The title to be placed at the top of the Venn
 * @returns {object} The modified AnimatedVenn object
 */

DrillableVenn.prototype.add_title = function (title) {

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

DrillableVenn.prototype.redraw_venn = function (title) {

    var self = this;

    //Delete the existing svg and commentary
    d3.select(self.div).selectAll("svg").remove();
    d3.select(self.div).selectAll("#venn_context_side").remove();

    //Reset the size
    self.set_size();


    self.venn_chart = venn.VennDiagram()
        .width(self.width)
        .height(self.height);

    //Redraw the chart
    self = self.add_svg().add_venn(self.current_level).add_title(self.title, self.subtitle);

};
