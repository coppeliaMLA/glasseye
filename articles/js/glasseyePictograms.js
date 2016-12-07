//Class amd methods

var Bugs = function(processed_data, div, size, scales) {


    GlasseyeChart.call(this, div, size, undefined, 1000);

    this.processed_data = processed_data;

    //Make this less repetitive
    this.body_scale = scales[0].scale_func.range([5, 20]);
    this.ant_l_scale = scales[1].scale_func.range([0, 20]);
    this.ant_r_scale = scales[2].scale_func.range([0, 20]);
    
    this.leg_ml_scale = scales[3].scale_func.range([0, 20]);
    this.leg_mr_scale = scales[4].scale_func.range([0, 20]);

    this.leg_bl_scale = scales[5].scale_func.range([0, 20]);
    this.leg_br_scale = scales[6].scale_func.range([0, 20]);



}

Bugs.prototype = Object.create(GlasseyeChart.prototype);

Bugs.prototype.add_bugs = function() {

    var body_scale = this.body_scale;
    var ant_r_scale = this.ant_r_scale;
    var ant_l_scale = this.ant_l_scale;
    var leg_ml_scale = this.leg_ml_scale;
    var leg_mr_scale = this.leg_mr_scale;
    var leg_bl_scale = this.leg_bl_scale;
    var leg_br_scale = this.leg_br_scale;

    var bug_glyphs = this.chart_area.selectAll("bug_glyph")
                .data(this.processed_data)
                .enter()
                .append("g")
                .attr("class", "bug_glyph")
                .attr("transform", function(d, i) {
                    return ("translate(" + (10 + (i % 5) * 100) + "," + (10 + ((i - (i % 5))/5) * 100) + ")")
                });


    

    //Right ant
    bug_glyphs.append("line")
                .attr("class", "bugleg")
                .attr("x1", 50)
                .attr("y1", 50)
                .attr("x2", function(d) { 
                    return(50 + Math.cos(Math.PI / 3)*(body_scale(d.body)+ant_r_scale(d.ant_r)));
                    })
                .attr("y2", function(d) { 
                    return(50 - Math.sin(Math.PI / 3)*(body_scale(d.body)+ant_r_scale(d.ant_r)));
                    });

    //Left ant
    bug_glyphs.append("line")
                .attr("class", "bugleg")
                .attr("x1", 50)
                .attr("y1", 50)
                .attr("x2", function(d) { 
                    return(50 - Math.cos(Math.PI / 3)* (body_scale(d.body)+ant_l_scale(d.ant_l)));
                    })
                .attr("y2", function(d) { 
                    return(50 - Math.sin(Math.PI / 3)*(body_scale(d.body)+ant_l_scale(d.ant_l)));
                    });

    //Right bottom
    bug_glyphs.append("line")
                .attr("class", "bugleg")
                .attr("x1", 50)
                .attr("y1", 50)
                .attr("x2", function(d) { 
                    return(50 + Math.cos(Math.PI / 3)*(body_scale(d.body)+leg_br_scale(d.leg_br)));
                    })
                .attr("y2", function(d) { 
                    return(50 + Math.sin(Math.PI / 3)*(body_scale(d.body)+leg_br_scale(d.leg_br)));
                    });

    //Left bottom
    bug_glyphs.append("line")
                .attr("class", "bugleg")
                .attr("x1", 50)
                .attr("y1", 50)
                .attr("x2", function(d) { 
                    return(50 - Math.cos(Math.PI / 3)*(body_scale(d.body)+leg_bl_scale(d.leg_bl)));
                    })
                .attr("y2", function(d) { 
                    return(50 + Math.sin(Math.PI / 3)*(body_scale(d.body)+leg_bl_scale(d.leg_bl)));
                    });

    //Right middle
    bug_glyphs.append("line")
                .attr("class", "bugleg")
                .attr("x1", 50)
                .attr("y1", 50)
                .attr("x2", function(d) { 
                    return (50+ (body_scale(d.body)+leg_mr_scale(d.leg_mr)));
                    })
                .attr("y2", 50);

    //Left middle
    bug_glyphs.append("line")
                .attr("class", "bugleg")
                .attr("x1", 50)
                .attr("y1", 50)
                .attr("x2", function(d) { 
                    return (50 - (body_scale(d.body)+leg_ml_scale(d.leg_ml)));
                    })
                .attr("y2", 50);

    bug_glyphs.append("circle")
                .attr("class", "bugbody")
                .attr("cx", 50)
                .attr("cy", 50)
                .attr("r", function(d) { 
                    return body_scale(d.body)})
                //.attr("r", 10)
                .attr("fill", d3.hsl("hsl(204, 70%, 23%)"));

    bug_glyphs.append("text")
            .attr("x", 50)
            .attr("y", 95)
            .attr("text-anchor", "middle")
            .text(function(d){return (d.label)});


}


//Builder function

function bugs(data, div, size){

    var inline_parser = function(data) {
        return data;
    }

    var csv_parser = function(data) {
        
        var processed_data = data.map(function(d) {
            return {
                label: d.label,
                body: -d.body,
                ant_l: +d.ant_l,
                ant_r: +d.ant_r,
                leg_ml: +d.leg_ml,
                leg_mr: +d.leg_mr,
                leg_bl: +d.leg_ml,
                leg_br: +d.leg_mr,
            }
        });

        return processed_data;
    }

    var draw = function(processed_data, div, size) {

        console.log(processed_data);

        //Make this nicer

        var body_values = processed_data.map(function(d) {
            return d.body;
        });

        var ant_l_values = processed_data.map(function(d) {
            return d.ant_l;
        });

        var ant_r_values = processed_data.map(function(d) {
            return d.ant_r;
        });

        var leg_ml_values = processed_data.map(function(d) {
            return d.leg_ml;
        });

        var leg_mr_values = processed_data.map(function(d) {
            return d.leg_mr;
        });

        var leg_bl_values = processed_data.map(function(d) {
            return d.leg_bl;
        });

        var leg_br_values = processed_data.map(function(d) {
            return d.leg_br;
        });

    
        var scales = [create_scale(body_values, d3.scale.linear()), create_scale(ant_l_values, d3.scale.linear()), create_scale(ant_r_values, 
            d3.scale.linear()), create_scale(leg_ml_values, d3.scale.linear()), create_scale(leg_mr_values, d3.scale.linear()), create_scale(leg_bl_values, d3.scale.linear())
        , create_scale(leg_br_values, d3.scale.linear())];
    

        var glasseye_chart = new Bugs(processed_data, div, size, scales);

        glasseye_chart.add_svg().add_bugs();

    }

    build_chart(data, div, size, undefined, csv_parser, inline_parser, draw);

}

