//Glasseye chart super class: sets up the svg and the chart area
var GlasseyeChart = function(div, size, margin, height) {

    this.div = div;
    this.size = size;

    //Set chart dimensions according to whether the chart is placed in the margin or the main page
    if (size === "full_page") {
        this.svg_width = 500;
        this.svg_height = (height === undefined) ? 300 : height;

        if (margin === undefined) {
            this.margin = {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            }
        } else {
            this.margin = margin;
        }


    } else {
        this.svg_width = 300;
        this.svg_height = (height === undefined) ? 250 : height;

        if (margin === undefined) {
            this.margin = {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            }
        } else {
            this.margin = margin;
        }
    }

    //Work out the dimensions of the chart
    this.width = this.svg_width - this.margin.left - this.margin.right;
    this.height = this.svg_height - this.margin.top - this.margin.bottom;
}

GlasseyeChart.prototype.add_svg = function() {

    //Add the svg to the div
    this.svg = d3.select(this.div).append("svg")
        .attr("width", this.svg_width)
        .attr("height", this.svg_height);

    //Add the chart area to the svg
    this.chart_area = this.svg.append("g")
        .attr("class", "chart_area")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    return this;
}

//Sub classes for the glasseye charts

var GridChart = function(div, size, labels, scales, margin) {

    GlasseyeChart.call(this, div, size, margin);

    this.labels = labels;
    this.scales = scales;

    if (scales[0].scale_type === "ordinal") {
        this.x = scales[0].scale_func.rangePoints([0, this.width], 1)
    } else {
        this.x = scales[0].scale_func.range([0, this.width])
    }
    
    if (scales[1].scale_type === "ordinal") {
        this.y = scales[1].scale_func.rangePoints([this.height, 0], 1)
    } else {
        this.y = scales[1].scale_func.range([this.height, 0])
    }


    this.x_axis = d3.svg.axis()
        .scale(this.x)
        .orient("bottom")
        .tickSize(-this.height, 0, 0)
        .tickPadding(10);

    this.y_axis = d3.svg.axis()
        .scale(this.y)
        .orient("left")
        .tickSize(-this.width, 0, 0);

}

GridChart.prototype = Object.create(GlasseyeChart.prototype);

GridChart.prototype.add_grid = function() {

    var x_axis_g = this.chart_area.append("g")
        .attr("class", "chart_grid")
        .attr("transform", "translate(0," + this.height + ")")
        .call(this.x_axis);

    if (this.scales[0].scale_type === "nonlinear") {
        x_axis_g.selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-90)");
    }

    this.chart_area.append("g")
        .attr("class", "chart_grid")
        .call(this.y_axis);

    //Add labels if they have been provided

    if (typeof this.labels !== "undefined") {
        this.svg.append("g")
            .attr("class", "axis_label")
            .attr("transform", "translate(" + (this.margin.left + this.width + 15) + ", " + (this.height + this.margin.top) + ") rotate(-90)")
            .append("text")
            .text(this.labels[0]);

        this.svg.append("g")
            .attr("class", "axis_label")
            .attr("transform", "translate(" + this.margin.left + ", " + (this.margin.top - 8) + ")")
            .append("text")
            .text(this.labels[1]);
    }

    return this;

}


var LinePlot = function(processed_data, div, size, labels, scales) {

    GridChart.call(this, div, size, labels, scales);

    this.processed_data = processed_data;

    //Some customisations
    this.margin.left = 4;
    this.y_axis.tickFormat("");

    this.tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return d3.format(".3n")(d.y);
        })

    var x_scale = this.x,
        y_scale = this.y;

    this.line = d3.svg.line()
        .x(function(d) {
            return x_scale(d["x"]);
        })
        .y(function(d) {
            return y_scale(d["y"]);
        });

}

LinePlot.prototype = Object.create(GridChart.prototype);

LinePlot.prototype.add_line = function() {

    this.chart_area.call(this.tip);

    this.chart_area.append("path")
        .datum(this.processed_data)
        .attr("class", "line")
        .attr("d", this.line);

    var x_scale = this.x,
        y_scale = this.y;

    this.chart_area.selectAll("line_points")
        .data(this.processed_data)
        .enter()
        .append("circle")
        .attr("class", "line_points")
        .attr("cx", function(d) {
            return x_scale(d["x"]);
        })
        .attr("cy", function(d) {
            return y_scale(d["y"]);
        })
        .attr("r", 10)
        .attr("opacity", 0)
        .on('mouseover', this.tip.show)
        .on('mouseout', this.tip.hide);

    return this;

}

var BarChart = function(processed_data, div, size, labels, scales) {

    GridChart.call(this, div, size, labels, scales);

    this.processed_data = processed_data;

    //Some customisations
    this.margin.left = 4;
    this.y_axis.tickFormat("");

    this.tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return d3.format(".3n")(d.value);
        })

    this.bar_width = this.width / processed_data.length;

}

BarChart.prototype = Object.create(GridChart.prototype);

BarChart.prototype.add_bars = function() {

    this.chart_area.call(this.tip);

    var x_scale = this.x,
        y_scale = this.y,
        height = this.height
        bar_width = this.bar_width;

    this.chart_area.selectAll(".bar")
        .data(this.processed_data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
            return x_scale(d.category) - bar_width/4;
        })
        .attr("y", function(d) {
            return y_scale(d.value);
        })
        .attr("width", this.bar_width/2)
        .attr("height", function(d) {
            return height - y_scale(d.value);
        })
        .on('mouseover', this.tip.show)
        .on('mouseout', this.tip.hide);

    return this;

}


var Gantt = function(processed_data, div, size, scales) {

    this.div = div;
    this.processed_data = processed_data;

    GridChart.call(this, div, size, ["Time", "Tasks"], scales, {
        top: 20,
        bottom: 80,
        left: 80,
        right: 20
    });

    this.tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return Math.floor((d.end - d.start) / (1000 * 60 * 60 * 24)) + " days";
        })

    this.bar_width = this.width / processed_data.length;

}

Gantt.prototype = Object.create(GridChart.prototype);

Gantt.prototype.add_tasks = function() {

    var x_scale = this.x,
        y_scale = this.y
        bar_width = this.bar_width;  

    this.chart_area.call(this.tip);
    this.chart_area.selectAll(".task")
        .data(this.processed_data)
        .enter()
        .append("rect")
        .attr("class", "task")
        .attr("y", function(d) {
            return y_scale(d.task) - bar_width/6;
        })
        .attr("x", function(d) {
            return x_scale(d.start);
        })
        .attr("height", this.bar_width/3)
        .attr("width", function(d) {
            return x_scale(d.end) - x_scale(d.start);
        })
        .on('mouseover', this.tip.show)
        .on('mouseout', this.tip.hide);

    return this;

}


var Donut = function(processed_data, div, size) {

    margin = {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5
    };

    GlasseyeChart.call(this, div, size, margin);

    this.processed_data = processed_data;

    var total_value = d3.sum(processed_data.map(function(d) {
        return d.value
    }));

    this.tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return d.data.label + "<br><br>" + d.data.value + "<br><br>" + d3.format("%")(d.data.value / total_value);
        });

    var radius = this.height / 2;

    this.arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 70);

    this.pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
            return d.value;
        });

}


Donut.prototype = Object.create(GlasseyeChart.prototype);

Donut.prototype.add_donut = function() {

    var svg_donut = this.chart_area.append("g")
        .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

    var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    svg_donut.call(this.tip);

    var g = svg_donut.selectAll(".arc")
        .data(this.pie(this.processed_data))
        .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", this.arc)
        .style("fill", function(d) {
            return color(d.data.label);
        })
        .on('mouseover', this.tip.show)
        .on('mouseout', this.tip.hide);

    var arc = this.arc;

    g.append("text")
        .attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")";
        })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function(d) {
            if (d.endAngle - d.startAngle > 0.35) {
                return d.data.label;
            } else {
                return "";
            }
        });

}

var Tree = function(processed_data, div, size){

    var margin = (size === "full_page") ? {top: 5, bottom: 5, left: 100, right: 100} : {top: 5, bottom: 5, left: 50, right: 50};

    GlasseyeChart.call(this, div, size, margin, 300);

    this.processed_data = processed_data;

    var cluster = d3.layout.tree()
    .size([this.height, this.width]);

    this.nodes = cluster.nodes(processed_data),
    this.links = cluster.links(this.nodes);

    this.diagonal = d3.svg.diagonal()
        .projection(function (d) {
        return [d.y, d.x];
    });

}

Tree.prototype = Object.create(GlasseyeChart.prototype);

Tree.prototype.add_tree = function() {

    var link = this.chart_area.selectAll(".treelink")
        .data(this.links)
        .enter().append("path")
        .attr("class", "treelink")
        .attr("d", this.diagonal);

    var node = this.chart_area.selectAll(".treenode")
        .data(this.nodes)
        .enter().append("g")
        .attr("class", "treenode")
        .attr("transform", function (d) {
        return "translate(" + d.y + "," + d.x + ")";
    })

    node.append("circle")
        .attr("r", 4.5);

    var abbr_len = (this.size === "full_page") ? 20 : 10;

    node.append("text")
        .attr("dx", function (d) {
        return d.children ? -8 : 8;
    })
        .attr("dy", 3)
        .style("text-anchor", function (d) {
        return d.children ? "end" : "start";
    })
        .text(function (d) {
        return abbrev(d.name, abbr_len);
    });

}

var Force = function(processed_data, div, size){

    var margin = (size === "full_page") ? {top: 5, bottom: 5, left: 100, right: 100} : {top: 5, bottom: 5, left: 50, right: 50};

    GlasseyeChart.call(this, div, size, margin, 300);

    this.processed_data = processed_data;

    //Set up the force layout
    this.force = d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([this.width, this.height]);

    this.tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return d.name
        });

}


Force.prototype = Object.create(GlasseyeChart.prototype);

Force.prototype.add_force = function() {

    var color = d3.scale.category20();

    this.chart_area.call(this.tip);

    //Creates the graph data structure out of the json data
    this.force.nodes(this.processed_data.nodes)
        .links(this.processed_data.links)
        .start();

    //Create all the line svgs but without locations yet
    var link = this.chart_area.selectAll(".forcelink")
        .data(this.processed_data.links)
        .enter().append("line")
        .attr("class", "forcelink")
        .style("stroke-width", function (d) {
        return Math.sqrt(d.value);
    });

    //Do the same with the circles for the nodes - no 
    var node = this.chart_area.selectAll(".forcenode")
        .data(this.processed_data.nodes)
        .enter().append("circle")
        .attr("class", "forcenode")
        .attr("r", 8)
        .style("fill", function(d) {return color(d.group)})
        .call(this.force.drag)
        .on('mouseover', this.tip.show)
        .on('mouseout', this.tip.hide);



    //Now we are giving the SVGs co-ordinates - the force layout is generating the co-ordinates which this code is using to update the attributes of the SVG elements
    this.force.on("tick", function () {
        link.attr("x1", function (d) {
            return d.source.x;
        })
            .attr("y1", function (d) {
            return d.source.y;
        })
            .attr("x2", function (d) {
            return d.target.x;
        })
            .attr("y2", function (d) {
            return d.target.y;
        });

        node.attr("cx", function (d) {
            return d.x;
        })
            .attr("cy", function (d) {
            return d.y;
        });
    });

}

//Functions to draw charts


function tree(data, div, size){

var inline_parser = function(data) {
        return data;
    }

    var csv_parser = function(data) {
        return data;
    }

    var draw = function(processed_data, div, size) {

        var glasseye_chart = new Tree(processed_data, div, size);

        glasseye_chart.add_svg().add_tree();

    }

    build_chart(data, div, size, undefined, csv_parser, inline_parser, draw);


}

function force(data, div, size){

var inline_parser = function(data) {
        return data;
    }

    var csv_parser = function(data) {
        return data;
    }

    var draw = function(processed_data, div, size) {

        var glasseye_chart = new Force(processed_data, div, size);

        glasseye_chart.add_svg().add_force();

    }

    build_chart(data, div, size, undefined, csv_parser, inline_parser, draw);


}

function barchart(data, div, size){

var inline_parser = function(data) {

        processed_data = [];

        for (i = 0; i < data.value.length; i++) {
            data_item = {
                "category": data.category[i],
                "value": +data.value[i]
            };
            processed_data.push(data_item);

        }

        return processed_data;

    }

    var csv_parser = function(data) {
        return data;
    }

    var draw = function(processed_data, div, size) {

        var x_values = processed_data.map(function(d) {return d.category;});
        var y_values = processed_data.map(function(d) {return d.value;});
        var scales = [create_scale(x_values, d3.scale.ordinal()), create_scale(y_values, d3.scale.linear())];

        var glasseye_chart = new BarChart(processed_data, div, size, ["category", "value"], scales);

        glasseye_chart.add_svg().add_grid().add_bars();

    }

    build_chart(data, div, size, undefined, csv_parser, inline_parser, draw);


}

function donut(data, div, size) {

    var inline_parser = function(data) {

        processed_data = []

        for (i = 0; i < data.values.length; i++) {
            data_item = {
                "label": data.labels[i],
                "value": +data.values[i]
            };
            processed_data.push(data_item);

        }

        return processed_data;

    }

    var csv_parser = function(data) {
        return data;
    }

    var draw = function(processed_data, div, size) {

        var glasseye_chart = new Donut(processed_data, div, size);

        glasseye_chart.add_svg().add_donut();

    }

    build_chart(data, div, size, undefined, csv_parser, inline_parser, draw);

}


function lineplot(data, div, size, labels) {


    var inline_parser = function(data) {

        var processed_data = [];

        for (i = 0; i < data.x.length; i++) {
            data_item = {
                "x": +data.x[i],
                "y": +data.y[i]
            };
            processed_data.push(data_item);
        }

        return processed_data;
    }

    var csv_parser = function(data) {

        var processed_data = data.map(function(d) {
            return {
                x: +d.x,
                y: +d.y
            }
        });

        return processed_data;

    }

    var draw = function draw_lineplot(processed_data, div, size, labels) {

        var x_values = processed_data.map(function(d) {
            return d.x
        });
        var y_values = processed_data.map(function(d) {
            return d.y
        });
        var scales = [create_scale(x_values, d3.scale.linear()), create_scale(y_values, d3.scale.linear())];
        var glasseye_chart = new LinePlot(processed_data, div, size, labels, scales);
        glasseye_chart.add_svg().add_grid().add_line();

    }

    build_chart(data, div, size, labels, csv_parser, inline_parser, draw);

}

function gantt(data, div, size) {

    var inline_parser = function(data) {

        var parse_date = d3.time.format("%d/%m/%Y").parse;

        //Parse the dates
        data.forEach(function(d) {
            d.start = parse_date(d.start);
            d.end = parse_date(d.end);
        });


        data.sort(function(a, b) {
            return b.start - a.start;
        })

        return data;

    }


    var csv_parser = function(data) {

        //To be written

    }

    var draw = function(processed_data, div, size) {

        var starts = processed_data.map(function(d) {
            return d.start;
        });

        var ends = processed_data.map(function(d) {
            return d.end;
        });

        var x_values = starts.concat(ends);

        var y_values = processed_data.map(function(d) {
            return d.task;
        });

        var scales = [create_scale(x_values, d3.time.scale()), create_scale(y_values, d3.scale.ordinal())];


        var glasseye_chart = new Gantt(processed_data, div, size, scales);
        glasseye_chart.add_svg().add_grid().add_tasks();

    }

    build_chart(data, div, size, undefined, csv_parser, inline_parser, draw);

}


//Adhoc charts (not using OO or using only the glasseye chart super class)

function treemap(data, div, size) {

    var inline_parser = function(data) {
        return data;
    }

    var csv_parser = function(data) {
        //Needs to be written
    }

    var draw = function(processed_data, div, size) {

        var w = 300,
            h = 400,
            x = d3.scale.linear().range([0, w]),
            y = d3.scale.linear().range([0, h]),
            color = d3.scale.category20c(),
            root,
            node;

        var treemap = d3.layout.treemap()
            .round(false)
            .size([w, h])
            .sticky(true)
            .value(function(d) {
                return d.size;
            });

        var svg = d3.select(div)
            .append("svg:svg")
            .attr("width", w)
            .attr("height", h)
            .append("svg:g")
            .attr("transform", "translate(.5,.5)");

        var node = root = data;

        var nodes = treemap.nodes(root)
            .filter(function(d) {
                return !d.children;
            });

        var cell = svg.selectAll("g")
            .data(nodes)
            .enter().append("svg:g")
            .attr("class", "cell")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .on("click", function(d) {
                return zoom(node == d.parent ? root : d.parent);
            });

        cell.append("svg:rect")
            .attr("width", function(d) {
                return d.dx - 1;
            })
            .attr("height", function(d) {
                return d.dy - 1;
            })
            .style("fill", function(d) {
                return color(d.parent.name);
            });

        cell.append("svg:text")
            .attr("x", function(d) {
                return d.dx / 2;
            })
            .attr("y", function(d) {
                return d.dy / 2;
            })
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(function(d) {
                return d.name;
            })
            //.style("opacity", function(d) { d.w = this.getComputedTextLength(); return d.dx > d.w ? 1 : 0; })
            .call(wrap, 80);

        d3.select(window).on("click", function() {
            zoom(root);
        });

        d3.select("select").on("change", function() {
            treemap.value(this.value == "size" ? size : count).nodes(root);
            zoom(node);
        });

        function size(d) {
            return d.size;
        }

        function count(d) {
            return 1;
        }

        function zoom(d) {
            var kx = w / d.dx,
                ky = h / d.dy;
            x.domain([d.x, d.x + d.dx]);
            y.domain([d.y, d.y + d.dy]);

            var t = svg.selectAll("g.cell").transition()
                .duration(d3.event.altKey ? 7500 : 750)
                .attr("transform", function(d) {
                    return "translate(" + x(d.x) + "," + y(d.y) + ")";
                });

            t.select("rect")
                .attr("width", function(d) {
                    return kx * d.dx - 1;
                })
                .attr("height", function(d) {
                    return ky * d.dy - 1;
                })

            t.select("text")
                .attr("x", function(d) {
                    return kx * d.dx / 2;
                })
                .attr("y", function(d) {
                    return ky * d.dy / 2;
                });
            //.style("opacity", function(d) { return kx * d.dx > d.w ? 1 : 0; });

            node = d;
            d3.event.stopPropagation();
        }

    }

    build_chart(data, div, size, undefined, csv_parser, inline_parser, draw);

}


function simplot(data, div, size) {

    var inline_parser = function(data) {
        //To be written
    }

    var csv_parser = function(data) {

        //Read in the different varaiations and simulations
        var variations = [];
        data.map(function(d) {
            if (variations.indexOf(d.variation) === -1) {
                variations.push(d.variation)
            }
        });

        var simulations = [];
        data.map(function(d) {
            if (simulations.indexOf(d.sim_num) === -1) {
                simulations.push(d.sim_num)
            }
        });

        //Create the json data from the csv data
        var processed_data = variations.map(function(v) {

            return {
                variation: v,
                simulations: simulations.map(function(s) {
                    return {
                        simulation: +s,
                        values: data.filter(function(d) {
                            return d.variation === v && d.sim_num === s
                        }).map(function(e) {
                            return {
                                value: +e.value,
                                iter: +e.day
                            }
                        })
                    }
                })
            }

        });

        var comp_data = {
            original_data: data,
            grouped_data: processed_data,
            variations: variations,
            simulations: simulations
        };

        return comp_data;

    }

    var draw = function(processed_data, div, size) {

        var glasseye_chart = new GlasseyeChart(div, size, {
            top: 20,
            bottom: 20,
            right: 100,
            left: 20
        });
        glasseye_chart.add_svg();

        var color = d3.scale.category20();

        //Set up the scales
        var x = d3.scale.linear()
            .range([0, glasseye_chart.width])
            .domain([d3.min(processed_data.original_data, function(d) {
                return +d["day"]
            }) - 10, d3.max(processed_data.original_data, function(d) {
                return +d["day"]
            })]);

        var y = d3.scale.linear()
            .range([glasseye_chart.height, 0])
            .domain([d3.min(processed_data.original_data, function(d) {
                return +d['value']
            }), d3.max(processed_data.original_data, function(d) {
                return +d['value']
            })]);

        //Set up the axes
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickSize(-glasseye_chart.height, 0, 0);

        var yAxis = d3.svg.axis()
            .scale(y)
            .tickSize(-glasseye_chart.width, 0, 0)
            .orient("left");

        var svg = glasseye_chart.chart_area;

        //Add the axes
        svg.append("g")
            .attr("class", "chart_grid")
            .attr("transform", "translate(0," + glasseye_chart.height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "chart_grid")
            .call(yAxis);

        //Create a path function
        var line = d3.svg.line()
            .interpolate("linear")
            .x(function(d) {
                return x(d.iter);
            })
            .y(function(d) {
                return y(d.value);
            });

        //var totalLength = width + 200; //At some point base this on path length

        //Add the simulation paths for each variation

        processed_data.grouped_data.forEach(function(v, j) {

            var path = svg.selectAll(".variations")
                .data(v.simulations)
                .enter()
                .append("g")
                .append("path")
                .attr("class", "line")
                .attr("d", function(d) {
                    return line(d.values);
                })
                .style("stroke", function(d) {
                    return color(v.variation);
                })
                .attr("opacity", function(d) {
                    if (d.simulation === -1) {
                        return 1
                    } else {
                        return 0.1
                    }
                });


            path.each(function(d) {
                    d.totalLength = this.getTotalLength();
                })
                .attr("stroke-dasharray", function(d) {
                    return d.totalLength + " " + d.totalLength;
                })
                .attr("stroke-dashoffset", function(d) {
                    return d.totalLength;
                })
                .transition()
                .delay(j * 7000)
                .duration(7000)
                .ease("linear")
                .attr("stroke-dashoffset", 0)
                .transition()
                .duration((processed_data.variations.length - 1 - j) * 7000)
                .attr("stroke-dashoffset", 0)
                .each("end", repeat);


            function repeat() {
                var path = d3.select(this);
                path.attr("stroke-dasharray", function(d) {
                        return d.totalLength + " " + d.totalLength;
                    })
                    .attr("stroke-dashoffset", function(d) {
                        return d.totalLength;
                    })
                    .transition()
                    .delay(j * 7000)
                    .duration(7000)
                    .ease("linear")
                    .attr("stroke-dashoffset", 0)
                    .transition()
                    .duration((processed_data.variations.length - 1 - j) * 7000)
                    .attr("stroke-dashoffset", 0)
                    .each("end", repeat);
            }


        });


        if (processed_data.variations.length > 1) {

            add_legend(svg, glasseye_chart.width + glasseye_chart.margin.left, glasseye_chart.margin.top, processed_data.variations.map(function(v) {
                return {
                    "label": v,
                    "colour": color(v)
                }
            }));
        }
    }

    build_chart(data, div, size, undefined, csv_parser, inline_parser, draw);

}

function dot_plot(file, div, size) {

    //Set up the layout variables

    var svg_width = 650,
        svg_height = 400;

    var margin = {
            top: 20,
            right: 250,
            bottom: 110,
            left: 30
        },
        width = svg_width - margin.left - margin.right,
        height = svg_height - margin.top - margin.bottom;

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return d.value;
        })


    d3.csv(file, function(error, data) {


        //Set up color scales
        var color = d3.scale.category10()

        //Read in the different varaiations and simulations
        var groups = [];
        data.map(function(d) {
            if (groups.indexOf(d.group) === -1) {
                groups.push(d.group)
            }
        });


        //Read in the different varaiations and simulations
        var variables = [];
        data.map(function(d) {
            if (variables.indexOf(d.variable) === -1) {
                variables.push(d.variable)
            }
        });


        //Create the json data from the csv data
        var processed_data = groups.map(function(g) {

            return {
                group: g,
                values: data.filter(function(d) {
                    return d.group === g
                }).map(function(e) {
                    return {
                        value: +e.value,
                        variable: e.variable
                    }
                })
            }
        });


        //This where we add the ordinal scales

        var min_y = d3.min(data, function(d) {
                return +d['value']
            }),
            max_y = d3.max(data, function(d) {
                return +d['value']
            }),
            range_y = max_y - min_y;

        //Work out the ratio of the range of y to max_y

        var range_max_ratio = range_y / max_y;

        var y = d3.scale.linear()
            .range([height, 0]);

        if (range_max_ratio < 0.3) {
            y.domain([min_y - 0.1 * range_y, max_y + 0.1 * range_y]).nice;
        } else {
            y.domain([0, max_y]).nice;
        }


        //Set up the scales
        var x = d3.scale.ordinal()
            .rangePoints([0, width], 1)
            .domain(variables);

        //Set up the axes
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickSize(-height, 0, 0)
            .tickFormat(function(d) {
                if (d.length > 15) {
                    return d.substring(0, 15) + "..";
                } else {
                    return d;
                }
            });

        var yAxis = d3.svg.axis()
            .scale(y)
            .tickSize(-width, 0, 0)
            .orient("left");

        //Add the svg
        var svg = d3.select(div).append("svg")
            .attr("width", svg_width)
            .attr("height", svg_height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.call(tip);

        //Add the axes
        svg.append("g")
            .attr("class", "chart_grid")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-90)");

        svg.append("g")
            .attr("class", "chart_grid")
            .call(yAxis);


        //Add the simulation paths for each variation
        processed_data.forEach(function(v, j) {


            svg.selectAll(".dot")
                .data(v.values)
                .enter()
                .append("circle")
                .attr("cx", function(d) {
                    return x(d.variable)
                })
                .attr("cy", function(d) {
                    return y(d.value)
                })
                .attr("r", 6)
                .attr("fill", function(d) {
                    return color(v.group)
                })
                .attr("opacity", 0.5)
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);



        });

        if (groups.length > 1) {
            add_legend(svg, width + margin.left, margin.top, groups.map(function(v) {
                return {
                    "label": v,
                    "colour": color(v)
                }
            }));
        }
    });

    //Put 

    //ordinal.rangePoints(interval[, padding])

}



//All purpose functions

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

            if (range_max_ratio < 0.2) {
                scale.domain([min - 0.1 * range, max + 0.1 * range]).nice;
            } else {
                scale.domain([0, max + 0.1 * range]).nice;
            }

            var scale_type = "linear";

        } else {

            scale.domain([min, max]).nice;

            var scale_type = "nonlinear";
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

        var processed_data = inline_parser(data)

        draw(processed_data, div, size, labels);

    } else

    {


        d3.csv(data, function(error, data) {

            var processed_data = csv_parser(data)

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
        .attr("x", 10)
        .attr("y", function(d, i) {
            return i * 15
        })
        .attr("fill", function(d, i) {
            return d.colour
        });

    legend_groups.append("text")
        .attr("x", 27)
        .attr("y", function(d, i) {
            return 8 + i * 15
        })
        .text(function(d) {
            return d.label
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
            tspan = text.text(null).append("tspan").attr("x", 40).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 40).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}

function abbrev(text, max){

    if (text.length > max) {
        text = text.substring(0, max-3) + "..."
    }

    return text;

}