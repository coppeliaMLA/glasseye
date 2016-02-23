//A template for glasseye charts

/*
The chart object class.
Contains functions (including closures) and variables that describe the chart in the abstract.
No svg elements are created here.
Even where the chart can be implemented almost entirely by a closure, the closure is constructed
in the object and then executed (and modified) in the methods. This way we have framework that is flexible
enough fpr both techniques.
*/

var LogisticCurve = function(formula) {

  //Store arguments
  this.formula = formula.replace(/ /g, '');

  //Parse the formula
  var right_left = this.formula.split("=");

  var response = right_left[0];
  var explanatory = right_left[1].split("+");

  var parsed_formula = {
    response: response,
    explanatory: explanatory.map(function(d) {
      var coef_split = d.split("*");
      var coef = parseFloat(coef_split[0]);
      var range_split = coef_split[1].split("[");
      var variable = range_split[0];
      var variable_range = range_split[1].slice(0, -1).split(",").map(function(d){return parseFloat(d);});
      return {
        coef: coef,
        variable: variable,
        variable_range: variable_range
      };
    })
  };

  console.log(parsed_formula);

  //Logistic Function
  function logistic(linear_pred) {

    return linear_pred;

  }

  //Default parameters

  //Inherit any attributes or functions of a parent class
  //GlasseyeChart.call(this, x, y);

  //Any overides of parent attributes

  //Derive further attributes

  //Create functions or closures to be used in methods

  //Function to create logistic curve

  var line = d3.svg.line()
    .x(function(d) {
      return d.x;
    })
    .y(function(d) {
      return d.y;
    })
    .interpolate("basis");

};

//Methods for the class. This is where svgs are created

/*
//Inherit methods from parent
XChart.prototype = Object.create(YParent.prototype);

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
*/
