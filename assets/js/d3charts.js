function BaseChart(element, width, height, margin) {
    var theChart = this;
    theChart.host = d3.select(element);
    if(theChart.host.empty()) {
        theChart.host = d3.select('body').append('div').attr('id', element);
    }
    theChart.svg = theChart.host.append("svg");
    theChart.rootg = theChart.svg.append("g");
    theChart.toolbar = theChart.rootg.append("g").attr("class", "toolbar");
    theChart.canvas = theChart.rootg.append("g").attr("class", "canvas");

    theChart.onSize = function() {}
    theChart.getToolBarSize = function() {
        var tw = 0;
        theChart.toolbar.selectAll('text.button').each(function() {
            tw += this.getBBox().width+10;
        });
        return tw;
    }
    theChart.size = function(w, h, m) {
        m = (typeof m === "undefined") ? {margin: theChart.margin, svgani: false}: m;
        var svg = theChart.svg;
        if(m.svgani) {
            svg.transition().duration(750)
                .attr("width", w)
                .attr("height", h);
        } else {
            svg.attr("width", w)
                .attr("height", h);
        }

        theChart.margin = m.margin;
        theChart.width = w - m.margin.left - m.margin.right;
        theChart.height = h - m.margin.top - m.margin.bottom;

        theChart.rootg.attr("transform", "translate(" + m.margin.left + "," + m.margin.top + ")");
        var x = (theChart.width-theChart.getToolBarSize())/2;
        x = (x>0)?x:0;
        theChart.toolbar.transition().duration(500)
            .attr("transform", "translate(" + x + ", 0)");
        if(theChart.loaded) {
            theChart.onSize();
        }
        var loading = theChart.svg.selectAll('g.loadingIcon');
        if(!loading.empty()) {
            loading.remove();
            theChart.startLoading();
        }
    }
    theChart.size(width, height, {margin:margin, svgani:false});
    theChart.addToolButton = function(label, onClick) {
        var tw = theChart.getToolBarSize();
        return theChart.toolbar.append("text")
            .attr("x", tw)
            .attr("y", 0)
            .attr("name", label)
            .attr("class", "button")
            .text(label)
            .on("click", onClick);
    }
    theChart.hide = function(data) {
        this.svg.style('display', 'none');
    }
    theChart.show = function(data) {
        this.svg.style('display', '');
    }
    theChart.draw = function(data) {}

    theChart.load = function(data) {
        this.canvas.transition().attr('opacity', 0);
        this.canvas.selectAll('*').remove();
        this.draw(data);
        this.onSize();
        this.rootg.selectAll('g.loadingIcon').transition().attr('opacity', 0).remove();
        this.canvas.transition().attr('opacity', 1);
        this.loaded = true;
    }
    theChart.startLoading = function() {
        this.loaded = false;
        var t0 = Date.now();

        var R = Math.min(theChart.width, theChart.height)/6;
        var planets = [5, 5, 5, 5, 5];

        this.canvas.transition().attr('opacity', 0.4);
        var container = this.rootg.append("g")
            .attr("transform", "translate(" + theChart.width/2 + "," + theChart.height/2 + ")")
            .attr("class", "loadingIcon");

        container.selectAll("g.planet").data(planets).enter().append("g")
            .attr("class", "planet").each(function(d, i) {
                d3.select(this).append("circle").attr("r", R/4).attr("cx",R)
                    .attr("cy", 0).attr("class", "planet")
                    .style("fill", '#444');
            });

        d3.timer(function() {
            var delta = (Date.now() - t0);
            theChart.rootg.selectAll("g.planet").attr("transform", function(d, i) {
                return "rotate(" + (i*360/planets.length+delta * d/40) + ")";
            });
            return theChart.loaded;
        });
        return this;
    }
    theChart.tsv = function(url, onLoad) {
        this.startLoading();
        d3.tsv(url, function(error, data) {
            if( error == null) {
                theChart.load(data);
                onLoad();
            } else {
                theChart.host.html(error);
            }
        });
    }
}

function LineChart(element, width, height, margin, y_label, date_format) {

    function findDuplicateDate(x, sFormat) {
        return function() {
            var months = x.ticks().map(function(d) {
                return rootl.parseDate(d);
            });
            for(var i=0; i<months.length-1; i++) {
                if(months[i] == months[i+1]) {
                    return true;
                }
            }
            return false;
        }
    }

    BaseChart.call(this, element, width, height, margin);
    var rootl = this;
    rootl.y_label = y_label

    rootl.x = d3.time.scale().range([0, rootl.width]);
    rootl.y = d3.scale.linear().range([rootl.height, 0]);
    rootl.yAxis = d3.svg.axis().scale(rootl.y).orient("left");

    rootl.color = d3.scale.category10();
    rootl.line = d3.svg.line().interpolate("linear").x(function(d) { return rootl.x(d.date); }).y(function(d) { return rootl.y(d.count); });

    rootl.dimensions = null;

    rootl.nomore = function() {
        return false;
    }

    rootl.zoom = d3.behavior.zoom()
        .scaleExtent([1, Infinity])
        .on("zoom", function() {
            if(rootl.nomore() && rootl.zoomLimit) {
                rootl.zoom.scale(rootl.zoomLimit[0]);
                rootl.zoom.translate(rootl.zoomLimit[1]);
            }
            rootl._draw();
        });
    rootl.rootg.insert("rect",":first-child")
        .attr("class", "overlay")
        .attr("width", rootl.width)
        .attr("height", rootl.height)
        .on('mousemove', function() {
            var pos = d3.mouse(this);
            rootl.zoom.center([pos[0], rootl.height]);
        })
        .on('click', function() {
            rootl.y.domain([ rootl.yMin, rootl.yMax ]);
            rootl._draw();
            rootl.focusLine = null;
            rootl.canvas.selectAll(".line")
                .style("opacity", 1)
                .style("stroke-width", null);
        })
        .on("dblclick.zoom", null)
        .call(rootl.zoom);

    rootl.resetBtn = rootl.addToolButton('reset', function () {
        rootl.zoom.scale(1).translate([0,0]);
        rootl.canvas.select("g.x.axis").transition().duration(750).call(rootl.xAxis);
        rootl.canvas.select("g.y.axis").transition().duration(750).call(rootl.yAxis)
            .each("end", function() {
                rootl.resetBtn.attr('opacity', '0');
            });
        rootl.canvas.selectAll("path.line").transition().duration(750).attr("d", function(d) { return rootl.line(d.values); });
    }).attr('opacity', '0');

    rootl.setDateFormat = function(sFormat) {
        rootl.parseDate = d3.time.format(sFormat);
        rootl.xAxis = d3.svg.axis().scale(rootl.x).orient("bottom").tickFormat(rootl.parseDate);
        var ss = sFormat.replace("%Y", "yyyy").replace("%m", "MM")
            .replace("%d", "dd").replace("%H", "hh").replace("%M", "mm");
        rootl.nomore = findDuplicateDate(rootl.x, ss);
    }
    rootl.setDateFormat(date_format);
    rootl._draw = function() {
        rootl.canvas.select("g.x.axis").call(rootl.xAxis);
        rootl.canvas.select("g.y.axis").call(rootl.yAxis);
        rootl.canvas.selectAll("path.line").attr("d", function(d) { return rootl.line(d.values); })
        rootl.zoomLimit = [rootl.zoom.scale(), rootl.zoom.translate()];
        rootl.resetBtn.attr('opacity',(rootl.zoomLimit[0] != 1 || rootl.zoomLimit[1][0] != 0 || rootl.zoomLimit[1][1] != 0)?'1':'0');
    }
    rootl.focus = function(d) {
        rootl.canvas.selectAll(".line")
            .style("opacity", 0.12)
            .filter(function(p) { return p.name == d; })
            .style("opacity", 1)
            .style("stroke-width", 2.5);
        rootl.focusLine = rootl.canvas.select('path.line[dimension='+d+']');
        var values = rootl.focusLine.data()[0].values;
        rootl.y.domain([
            d3.min(values, function(v) { return v.count; }),
            d3.max(values, function(v) { return v.count; })
        ]);
        rootl._draw();
    }
    rootl.onSize = function() {
        rootl.x.range([0, rootl.width]);
        rootl.y.range([rootl.height, 0]);
        rootl.zoom.scale(1);
        rootl.zoom.translate([0, 0]);
        rootl.zoom.x(rootl.x);
        rootl.rootg.select('rect.overlay').attr("width", rootl.width).attr("height", rootl.height);
        var tc = parseInt(rootl.width/rootl.x.tickWidth);
        tc = (tc>10)?10:tc;
        rootl.xAxis.ticks(tc);
        rootl.canvas.select("g.x.axis").call(function(axis, duration) {
            var start = axis.attr('transform');
            d3.select({}).transition().duration(duration)
                .tween("attr:transform", function() {
                    var i = d3.interpolateString(start, "translate(0, " + rootl.height + ")");
                    return function(t) { axis.attr("transform", i(t)); };
                });
        }, 500).call(function(axis, duration) {
            axis.transition().duration(duration).call(rootl.xAxis);
        }, 500);
        rootl.canvas.select("g.y.axis").transition().duration(500).call(rootl.yAxis);
        rootl.canvas.selectAll("path.line").transition().duration(500).attr("d", function(d) { return rootl.line(d.values); })
        rootl.legend.selectAll("rect").transition().duration(500)
            .attr("x", rootl.width + 70);
        rootl.legend.selectAll("text").transition().duration(500)
            .attr("x", rootl.width + 60);
    }
    rootl.draw = function (data) {
        rootl.color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

        data.forEach(function(d) {
            d.date = rootl.parseDate.parse(d.date);
        });

        rootl.dimensions = rootl.color.domain().map(function(name) {
            return {
                name: name,
                values: data.map(function(d) {
                    return {date: d.date, count: +d[name]};
                })
            };
        });

        rootl.x.domain(d3.extent(data, function(d) { return d.date; }));
        rootl.yMin = d3.min(rootl.dimensions, function(c) { return d3.min(c.values, function(v) { return v.count; }); });
        rootl.yMax = d3.max(rootl.dimensions, function(c) { return d3.max(c.values, function(v) { return v.count; }); });
        rootl.y.domain([ rootl.yMin, rootl.yMax ]);
        rootl.zoom.x(rootl.x);

        rootl.canvas.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + rootl.height + ")");

        rootl.canvas.append("g")
            .attr("class", "y axis")
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(rootl.y_label);

        rootl.focusLine = null;
        rootl.canvas.selectAll('.line').data(rootl.dimensions)
            .enter().append("path")
            .attr("class", "line")
            .attr("dimension", function(d) { return d.name; })
            .style("stroke", function(d) { return rootl.color(d.name); })
            .on("mouseover", function(d,i) {
                if(!rootl.focusLine) {
                    rootl.canvas.selectAll(".line")
                        .style("opacity", 0.12)
                        .filter(function(p) { return p.name == d.name; })
                        .style("opacity", 1)
                        .style("stroke-width", 2.5);
                }
            })
            .on("mouseout", function(d,i) {
                if(!rootl.focusLine) {
                    rootl.canvas.selectAll(".line")
                        .style("opacity", 1)
                        .style("stroke-width", null);
                }
            });

        rootl._draw();
        rootl.x.tickWidth = rootl.canvas.selectAll('g.x.axis g.tick text')[0][0].getBBox().width;

        rootl.legend = rootl.canvas.selectAll(".legend")
            .data(rootl.color.domain().slice().reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        rootl.legend.append("rect")
            .attr("x", rootl.width + 70)
            .attr("width", 18)
            .attr("height", 18)
            .on('click', rootl.focus)
            .style("cursor", "pointer")
            .style("fill", rootl.color);

        rootl.legend.append("text")
            .attr("x", rootl.width + 60)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });
    }
}
LineChart.prototype = Object.create(BaseChart.prototype);
LineChart.prototype.constructor = LineChart;
