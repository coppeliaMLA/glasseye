/**
 * Builds a AnimatedDensity object
 * @constructor
 * @param {array} processed_data Data that has been given a structure appropriate to the chart
 * @param {string} div The div in which the chart will be placed
 * @param {string} size The size (one of several preset sizes)
 * @param {array} [labels] An array of the axis labels
 * @param {array} scales Scales for the x and y axes
 * @param {object} [margin] Optional argument in case the default margin settings need to be overridden
 */

var AnimatedDensity = function (processed_data, div, size, labels, scales, margin) {

    var self = this;

    self.processed_data = processed_data;


    GridChart.call(self, div, size, labels, scales, margin);

};

AnimatedDensity.prototype = Object.create(GridChart.prototype);


/**
 * Adds the SVGs corresponding to the AnimatedDensity object
 *
 * @method
 * @returns {object} The modified AnimatedDensity object
 */

AnimatedDensity.prototype.add_density = function () {

    var self = this;

    /*self.chart_area.selectAll("rect").data(self.processed_data)
        .enter()
        .append("rect").attr("class", "block").attr("width", self.width / (10 * self.x.domain()[1])).attr("height", self.height / (self.y.domain()[1])).attr("x", function (d) {
        return self.x(d.value)
    }).attr("y", 0).attr("opacity", 0).transition()
        .duration(2500)
        .delay(function (d, i) {
            return i * 40;
        })
        .attr("y", function (d) {
            return self.height - d.position * self.height / (self.y.domain()[1]);
        })
        .attr("opacity", 1);
        */

     var radius = d3.max([self.width / (10 * self.x.domain()[1]), self.height / (self.y.domain()[1])]) + 2;

     self.chart_area.selectAll("rect").data(self.processed_data)
     .enter()
     .append("circle").attr("class", "block").attr("r", radius).attr("cx", function (d) {
     return self.x(d.value)
     }).attr("cy", 0).attr("opacity", 0).transition()
     .duration(2500)
     .delay(function (d, i) {
     return i * 40;
     })
     .attr("cy", function (d) {
     return self.height - d.position * self.height / (self.y.domain()[1]);
     })
     .attr("opacity", 1);

};


/**
 * Creates a animated density chart within a div
 *
 * @param {array} data Either the path to a csv file or inline data in glasseye
 * @param {string} div The div in which the chart will be placed
 * @param {string} size The size (one of several preset sizes)
 * @param {array} labels An array containing the labels of the x and y axes
 */


function animated_density(div, size) {

    var processed_data = []
    var cl = random_gamma(5, 1);
    for (i = 0; i < 5000; i++) {
        processed_data.push(cl());
    }

    processed_data = processed_data.map(function (d) {
        return Math.round(d * 10) / 10;
    })


    var density_array = Array.apply(null, Array(500)).map(Number.prototype.valueOf, 0);

    processed_data = processed_data.map(function (d) {
        density_array[d * 10] = density_array[d * 10] + 1;
        return {
            value: d,
            position: density_array[d * 10]
        };

    });


    var draw = function (processed_data, div, size) {

        var x_vals = processed_data.map(function (d) {
            return d.value
        });
        var y_vals = processed_data.map(function (d) {
            return d.position
        });

        var scales = [create_scale(d3.extent(x_vals), d3.scale.linear()), create_scale([0, d3.max(y_vals) + 5], d3.scale.linear())];

        var glasseye_chart = new AnimatedDensity(processed_data, div, size, ["Random Variable with Gamma Distribution", "Occurrences"], scales);

        glasseye_chart.add_svg().add_grid().add_density();


    };

    draw(processed_data, div, size);


}
