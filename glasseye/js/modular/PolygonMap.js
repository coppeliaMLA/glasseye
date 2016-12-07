/**
 * Builds an PolygonMap object
 * @constructor
 * @param {array} processed_data Data that has been given a structure appropriate to the chart
 * @param {string} div The div in which the chart will be placed
 * @param {string} size The size (one of several preset sizes)
 */

var PolygonMap = function (processed_data, div, size, tooltip_function) {

    var self = this;

    margin = {
        top: 5,
        bottom: 0,
        left: 5,
        right: 5
    };

    GlasseyeChart.call(self, div, size, margin, 700);

    self.processed_data = processed_data;

    self.tooltip_function = tooltip_function;

    self.projection = d3.geo.albers()
        .center([0, 55.4])
        .rotate([4.4, 0])
        .parallels([50, 60])
        .scale(self.width*300/46)
        .translate([self.width / 2, self.height / 2.4]);

    self.path = d3.geo.path()
        .projection(self.projection);

    self.tip = d3.select(self.div).append('div')
        .attr('class', 'hidden tooltip');


};

PolygonMap.prototype = Object.create(GlasseyeChart.prototype);

/**
 * Adds the SVGs corresponding to the PolygonMap object
 *
 * @method
 * @returns {object} The modified PolygonMap object
 */

PolygonMap.prototype.add_map = function () {

    var self = this;

    self.chart_area.selectAll(".map_region")
        .data(self.processed_data)
        .enter().append("path")
        .attr("class", function (d) {
            return "map_region " + d.properties["name"].split(' ').join('_');
        })
        .attr("d", self.path)
        .on('mouseenter', function (d) {
            self.tooltip_function(d.properties["name"]);
            var mouse = d3.mouse(self.chart_area.node()).map(function (d) {
                return parseInt(d);
            });
            self.tip.classed('hidden', false)
                .attr('style', 'left:' + (mouse[0]) +
                    'px; top:' + (mouse[1] - 0) + 'px')
                .html(d.properties["name"]);
        })
        .on('mouseleave', function () {
            self.tip.classed('hidden', true)
        });

    return this;

};


/**
 * Redraws the PolygonMap (for example after a resize of the div)
 * @method
 * @returns {object} The modified PolygonMap object
 */

PolygonMap.prototype.redraw_map = function (title) {

    var self = this;

    //Delete the existing svg and commentary
    d3.select(self.div).selectAll("svg").remove();

    //Reset the size
    self.set_size();

    self.projection = d3.geo.albers()
        .center([0, 55.4])
        .rotate([4.4, 0])
        .parallels([50, 60])
        .scale(self.width*300/46)
        .translate([self.width / 2, self.height / 2.4]);

    self.path = d3.geo.path()
        .projection(self.projection);

    //Redraw the chart
    self = self.add_svg().add_map().add_title(self.title, self.subtitle);

    return self;

};
