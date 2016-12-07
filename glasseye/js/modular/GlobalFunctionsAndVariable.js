//Global formatting functions

//Add span around text for highlighting
function highlight(d){
  return   "<span class = 'highlighted'>" + d + "</span>";
};

//Get max string length in an array of strings

function max_string_length(strings){

  var lengths = strings.map(function(d){return d.length})

  return Math.max.apply(null, lengths);

}


var uni_format = function(d){
  var return_val;

  if (d > 999) {
    return_val = d3.format(".3s")(d);
  }
  else if (d > 100) {
    return_val = d3.format(".3r")(d);
  }
  else if (d >= 10) {
    if (Math.round(d) === d) {
      return_val = d3.format(".0f")(d);
    }
    else {
      return_val = d3.format(".1f")(d);
    }
  }
  else if (d > 1) {
    return_val = d3.format(".1f")(d);
  }
  else
  {
    return_val = d3.format(".1f")(d);
  }
  return return_val;

};


var uni_format_range = function(d){

  var min = d[0], max = d[1];
  console.log(min);
  console.log(max);

  if (min > - 1000 & max < 1000) {return d3.format(",.0f");}
  else {return d3.format(",.0f");}

}


var uni_format_axis = function(d){
  var return_val;
  if (d >= 1) {
    return_val = d3.format("s")(d);
  }
  else
  {
    return_val = d3.format("")(d);
  }
  return return_val;

};

var format_millions = function(d) {
  return Math.round(d / 1000) + "m";
};

var format_millions_2d = function(d) {
  return d3.format(".3r")(d / 1000) + "m";
};


var quarter_year = function(d) {

  var month = d3.time.format("%m")(d);
  var year = d3.time.format("%Y")(d);
  var quarter = parseInt(month) / 3;

  return "Q" + quarter + " " + year;

};


//Commentary function to be used in tool tips and on side bars

function cap_first_letter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function lower_case(string) {
  return string.toLowerCase();
}

function unchanged(string) {
  return string;
}

function create_commentary(commentary_strings, embedded_vars, formats){


  var string_parts = commentary_strings.split("$");

  var text = "";

  embedded_vars.forEach(function(d, i){
    var formatter = (formats===undefined)? uni_format:formats[i];
    text = text + string_parts[i] + formatter(d);
  });

  return text;

}


function create_scale(data, d3_scale, padding) {

  var min = d3.min(data),
    max = d3.max(data);
  var range = max - min;
  var range_max_ratio = range / max;

  var scale = d3_scale;

  if (typeof d3_scale.rangePoints === "function") {
    scale.domain(data);
    var scale_type = "ordinal";
  } else {

    if (typeof data[0] === "number") {

      if (range_max_ratio < 0.25 || min < 0) {
        scale.domain([min - 0.1 * range, max + 0.1 * range]).nice;
      } else {
        scale.domain([0, max + 0.1 * range]).nice;
      }

      var scale_type = "linear";

    } else {

      scale.domain([min, max]).nice;

      if (data[0].constructor.name === "Date") {
        var scale_type = "datetime";
      } else {
        var scale_type = "nonlinear";
      }
    }

  }



  return {
    scale_func: scale,
    scale_type: scale_type
  };

}

//Data processing function

function build_chart(data, div, size, labels, csv_parser, inline_parser, draw) {


  if (typeof data === "object")

  {

    var processed_data = inline_parser(data);

    draw(processed_data, div, size, labels);

  } else

  {


    d3.csv(data, function(error, data) {

      var processed_data = csv_parser(data);
      draw(processed_data, div, size, labels);

    });

  }

}


function add_legend(svg, x, y, legend_data) {

  var legend_groups = svg.selectAll('.legend_item')
    .data(legend_data)
    .enter()
    .append('g')
    .attr('class', 'legend_item')
    .attr("transform", "translate(" + x + "," + y + ")");


  legend_groups.append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr('class', function(d) {
      return ('legend_block ' + d.class);
    })
    .attr("x", 10)
    .attr("y", function(d, i) {
      return i * 20;
    })
    .attr("fill", function(d, i) {
      return d.colour;
    });

  legend_groups.append("text")
    .attr("x", 27)
    .attr("y", function(d, i) {
      return 8 + i * 20;
    })
    .text(function(d) {
      return d.label;
    });

}


function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}


function abbrev(text, max) {

  if (text.length > max) {
    text = text.substring(0, max - 3) + "...";
  }

  return text;

}

function minmax_across_groups(processed_data, variable) {

  y_values = processed_data.map(function(d) {
    return (d.values.map(function(e) {
      if (e.variable === variable) {
        return e.value;
      }
    }));
  });
  y_values = [].concat.apply([], y_values);

  return ([d3.min(y_values), d3.max(y_values)]);

}

function create_class_label(prefix, x){

  return prefix + "_" + x.replace(/[.,\/#!$%\^&\*;:{}=+\-_`~()]/g,"").replace(" ","");

}