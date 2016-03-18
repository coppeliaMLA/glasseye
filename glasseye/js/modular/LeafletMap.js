/**
 * Builds an LeafletMap object
 * @constructor
 * @param {array} processed_data Data that has been given a structure appropriate to the chart
 * @param {string} div The div in which the chart will be placed
 * @param {string} size The size (one of several preset sizes)
 */

var LeafletMap = function(processed_data, div, size) {

    var self = this;

    margin = {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
    };

    GlasseyeChart.call(self, div, size, margin, 250);

    self.processed_data = processed_data;

    //Create a new leaflet map
    var map = new L.Map("map", {
        center: [51.5, 0.12],
        zoom: 8
    })
        .addLayer(new L.TileLayer("http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"));

    //Line up svg on leaflet panel
    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
        g = svg.append("g").attr("class", "leaflet-zoom-hide");


};

LeafletMap.prototype = Object.create(GlasseyeChart.prototype);

/**
 * Adds the SVGs corresponding to the LeafletMap object
 *
 * @method
 * @returns {object} The modified LeafletMap object
 */

LeafletMap.prototype.add_map = function() {



}
