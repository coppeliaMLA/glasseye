

/*
The chart object class.
Contains functions (including closures) and variables that describe the chart in the abstract.
No svg elements are created here.
Even where the chart can be implemented almost entirely by a closure, the closure is constructed
in the object and then executed (and modified) in the methods. This way we have framework that is flexible
enough fpr both techniques.
*/

/**
 * Builds a GroupedBarChart object
 * @constructor
 * @param {array} processed_data Data that has been given a structure appropriate to the chart
 * @param {string} div The div in which the chart will be placed
 * @param {string} size The size (one of several preset sizes)
 * @param {array} [labels] An array of the axis labels
 * @param {array} scales Scales for the x and y axes
 * @param {object} [margin] Optional argument in case the default margin settings need to be overridden
 */

var GroupedBarChart = function(x, y, z) {

  //Store arguments
  this.x = x;
  this.y = y;
  this.z = z;

  //Default parameters

  //Inherit any attributes or functions of a parent class
  YParent.call(this, x, y);

  //Any overides of parent attributes

  //Derive further attributes

  //Create functions or closures to be used in methods

};

//Methods for the class. This is where svgs are created

//Inherit methods from parent
XChart.prototype = Object.create(YParent.prototype);

/**
 * Adds the SVGs corresponding to the X object
 *
 * @method
 * @returns {object} The modified X object
 */

//Method for adding svgs
XChart.prototype.add_svg = function() {

  //Store this locally so that it can reference in further functions
  var self = this;

  //If necessary filter the data
  var filtered_data = function(){};

  //Draw the chart

  //Return the object so that we can use chaining
  return self;

};

/**
 * update_svg the SVGs corresponding to the X object
 *
 * @method
 * @returns {object} The modified X object
 */

//Method for updating svgs
XChart.prototype.update_svg = function() {

  //Store this locally so that it can reference in further functions
  var self = this;

  //If necessary filter the data
  var filtered_data = function(){};

  //Update the chart

  //Return the object so that we can use chaining
  return self;

};


//wrapper function to process the data and draw the chart

//

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
