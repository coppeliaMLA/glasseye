var heatmap_parser = function (data) {

        var processed_data;

        processed_data = data.map(function (d) {
            return {
                category_x: d.category_x,
                category_y: d.category_y,
                group: d.group,
                value: +d.value,
                nat_avg: +d.nat_avg,
                raw_value: +d.segment
            };
        });


        //Insert undefined for all combinations that don't appear

        //Get all groups
        var group = [];
        processed_data.map(function (d) {
            if (group.indexOf(d.group) === -1) {
                group.push(d.group);
            }
        });

        //Get all category_x
        var category_x = [];
        processed_data.map(function (d) {
            if (category_x.indexOf(d.category_x) === -1) {
                category_x.push(d.category_x);
            }
        });

        //Get all category_y
        var category_y = [];
        processed_data.map(function (d) {
            if (category_y.indexOf(d.category_y) === -1) {
                category_y.push(d.category_y);
            }
        });


        var augmented_data = []

        group.forEach(function (d) {
                category_x.forEach(function (e) {
                    category_y.forEach(function (f) {
                        var i = processed_data.filter(function (g) {
                            return g.group === d & g.category_x === e & g.category_y === f;
                        });

                        if (i.length === 0) {
                            augmented_data.push(
                                {
                                    category_x: e,
                                    category_y: f,
                                    group: d,
                                    value: undefined,
                                    nat_avg: undefined,
                                    raw_value: undefined
                                }
                        );
                        }
                        else {

                            augmented_data.push(i[0]);
                        }
                    })
                    ;
                })

            }
        )
        ;

        return (augmented_data);

    }
    ;


var polygon_map_parser = function (data) {

    var ireland = topojson.feature(data, data.objects.Ireland).features[0];
    var ulster = topojson.feature(data, data.objects.Ulster).features[0];
    var tv_regions = topojson.feature(data, data.objects.TVRegions).features;
    ireland.properties['name'] = "Ireland";
    ulster.properties['name'] = "Ulster";
    tv_regions.push(ireland);
    tv_regions.push(ulster);
    return (tv_regions);

};


var time_linked_venn_parser = function (data) {

    //Get all the dates

    var times = [];
    data.map(function (d) {
        if (times.indexOf(d.time) === -1) {
            times.push(d.time);
        }
    });

    var parse_date = d3.time.format("%d/%m/%Y").parse;

    //Create the json data from the csv data
    var processed_data = times.map(function (g) {

        return {
            time: parse_date(g),
            venns: data.filter(function (d) {
                return d.time === g;
            }).map(function (e) {
                return {
                    size: +e.value,
                    sets: e.group.split("_")

                };
            })
        };
    });

    return processed_data;

};

var drillable_venn_parser = function (data) {



    //Get all the parents

    var parents = [];
    data.map(function (d) {
        if (parents.indexOf(d.parent) === -1) {
            parents.push(d.parent);
        }
    });

    //Create the json data from the csv data
    var processed_data = parents.map(function (g) {

        return {
            parent: g,
            venns: data.filter(function (d) {
                return d.parent === g;
            }).map(function (e) {
                return {
                    size: +e.value,
                    sets: e.group.split("_")

                };
            })
        };
    });


    return processed_data;

};

var timeseries_parser = function (data) {

    var groups = [];
    data.map(function (d) {
        if (groups.indexOf(d.group) === -1) {
            groups.push(d.group);
        }
    });


    var parse_date = d3.time.format("%d/%m/%Y").parse;

    //Create the json data from the csv data
    var processed_data = groups.map(function (g) {

        return {
            group: g,
            values: data.filter(function (d) {
                return d.group === g;
            }).map(function (e) {
                return {
                    value: +e.value,
                    time: parse_date(e.time),
                    variable: e.variable
                };
            }).sort(function (a, b) {
                return (a.time - b.time);
            })
        };
    });

    return processed_data;

};

var time_linked_parser = function (data) {


    var categories = [];
    data.map(function (d) {
        if (categories.indexOf(d.category) === -1) {
            categories.push(d.category);
        }
    });

    //Try some date formats
    var parse_date = d3.time.format("%d/%m/%Y").parse;

    //Create the json data from the csv data
    var processed_data = categories.map(function (g) {

        return {
            category: g,
            values: data.filter(function (d) {
                return d.category === g;
            }).map(function (e) {
                return {
                    value: +e.value,
                    time: parse_date(e.time),
                    variable: e.variable
                };
            }).sort(function (a, b) {
                return (a.time - b.time);
            })
        };
    });

    return processed_data;

};

var dial_parser = function (data) {

    //Get all the groups

    //Get all the dates

    var groups = [];
    data.map(function (d) {
        if (groups.indexOf(d.group) === -1) {
            groups.push(d.group);
        }
    });

    //Create the json data from the csv data
    var processed_data = groups.map(function (g) {

        return {
            group: g,
            values: data.filter(function (d) {
                return d.group === g;
            }).map(function (e) {
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

var group_label_value_parser = function (data) {

    var processed_data;

    if (data[0].group === undefined) {

        processed_data = data.map(function (d) {
            return {label: d.label, value: +d.value};

        });

    } else {

        var groups = [];
        data.map(function (d) {
            if (groups.indexOf(d.group) === -1) {
                groups.push(d.group);
            }
        });

        //Create the json data from the csv data
        processed_data = groups.map(function (g) {
            var y0 = 0;
            return {
                group: g,
                values: data.filter(function (d) {
                    return d.group === g;
                }).map(function (e) {
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
