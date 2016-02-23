var time_linked_venn_parser = function(data) {

  //Get all the dates

  var times = [];
  data.map(function(d) {
    if (times.indexOf(d.time) === -1) {
      times.push(d.time);
    }
  });

  var parse_date = d3.time.format("%d/%m/%Y").parse;

  //Create the json data from the csv data
  var processed_data = times.map(function(g) {

    return {
      time: parse_date(g),
      venns: data.filter(function(d) {
        return d.time === g;
      }).map(function(e) {
        return {
          size: +e.value,
          sets: e.group.split("_")

        };
      })
    };
  });

  return processed_data;

};

var timeseries_parser = function(data) {

  var groups = [];
  data.map(function(d) {
    if (groups.indexOf(d.group) === -1) {
      groups.push(d.group);
    }
  });


  var parse_date = d3.time.format("%d/%m/%Y").parse;

  //Create the json data from the csv data
  var processed_data = groups.map(function(g) {

    return {
      group: g,
      values: data.filter(function(d) {
        return d.group === g;
      }).map(function(e) {
        return {
          value: +e.value,
          time: parse_date(e.time),
          variable: e.variable
        };
      }).sort(function(a, b) {
        return (a.time - b.time);
      })
    };
  });

  return processed_data;

};

var time_linked_parser = function(data) {


  var categories = [];
  data.map(function(d) {
    if (categories.indexOf(d.category) === -1) {
      categories.push(d.category);
    }
  });

  //Try some date formats
  var parse_date= d3.time.format("%d/%m/%Y").parse;

  //Create the json data from the csv data
  var processed_data = categories.map(function(g) {

    return {
      category: g,
      values: data.filter(function(d) {
        return d.category === g;
      }).map(function(e) {
        return {
          value: +e.value,
          time: parse_date(e.time),
          variable: e.variable
        };
      }).sort(function(a, b) {
        return (a.time - b.time);
      })
    };
  });

  return processed_data;

};

var dial_parser = function(data) {

  //Get all the groups

  //Get all the dates

  var groups = [];
  data.map(function(d) {
    if (groups.indexOf(d.group) === -1) {
      groups.push(d.group);
    }
  });

  //Create the json data from the csv data
  var processed_data = groups.map(function(g) {

    return {
      group: g,
      values: data.filter(function(d) {
        return d.group === g;
      }).map(function(e) {
        return {
          value: +e.value,
          variable: e.variable,
          label: e.label
        };
      })
    };
  });

  return processed_data;

};

var group_label_value_parser = function(data){

  var processed_data;

  if (data[0].group === undefined) {

  processed_data  = data.map(function(d){
    return {label: d.label, value: +d.value};

  });

} else {

  var groups = [];
  data.map(function(d) {
    if (groups.indexOf(d.group) === -1) {
      groups.push(d.group);
    }
  });

  //Create the json data from the csv data
  processed_data = groups.map(function(g) {
    var y0=0;
    return {
      group: g,
      values: data.filter(function(d) {
        return d.group === g;
      }).map(function(e) {
        return {
          value: +e.value,
          label: e.label,
          y0: y0,
          y1: y0 += +e.value
        };
      })
    };
  });


}

  return processed_data;

};
