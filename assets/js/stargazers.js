require.config({
    paths : {
        "jquery" : "/assets/lib/jquery.min",
        "jquery-cookie" : "/assets/lib/jquery.cookie",
        "bootstrap" : "/assets/lib/bootstrap/bootstrap.min",
        "d3" : "/assets/lib/d3.v3.min",
        "vue" : "/assets/lib/vue.min"
    },
    shim: {
        "bootstrap" : ["jquery"],
        "d3charts" : ["d3"]
    }
});
require(
    [
        'vue',
        'locale',
        'ga',
        'd3charts',
        'jquery-cookie'
    ],
    function(Vue, localeData, brook_ga) {
        Vue.config.delimiters = ['<%-', '%>']

        Vue.component('navbar', {
            template: '#navbar-template',
            replace: true,
            props: {
                model: Object
            },
            data: function () {
                var locale = $.cookie('locale') || "English";
                return localeData[locale];
            },
            methods: {
                changeLocale: function(evt) {
                    $.cookie('locale', $(evt.target).attr('locale'), { path: '/' });
                    var locale = $.cookie('locale') || "English";
                    this.$data = localeData[locale];
                },
                showContent: function(evt) {
                    var ss = $(evt.target).attr('section');
                    $.cookie('section', ss, { path: '/' });
                    if ($('#content').find('.section').length > 0) {
                        var locale = $.cookie('locale') || "English";
                        $('#content').find('.section').hide();
                        $('#content').find('.' + ss + "." + locale).show();
                    } else {
                        window.location.href = '/';
                    }
                    this.$el.find('.navbar-nav>li').removeClass('active');
                    $(evt.target).closest('li').addClass('active');
                }
            }
        });

        var chart = new LineChart('#users', 630, 300, {top: 20, right: 100, bottom: 30, left: 80}, "Stars", "%Y-%m-%d");
        d3.json('/assets/downloads/Surfingkeys.json', function(error, stargazers) {
            var groupByDate = {};
            stargazers.forEach(function(u) {
                var date = u.starred_at.substr(0, 10);
                groupByDate[date] = (groupByDate[date] || 0) + 1;
            });
            // var formatDate = d3.time.format("%Y-%M-%d");
            groupByDate = Object.keys(groupByDate).map(function(d) {
                return {
                    date: d,
                    count: groupByDate[d]
                }
            });

            chart.load(groupByDate);
        });

        d3.json('/assets/downloads/Surfingkeys.json', function(error, stargazers) {
            var groupByDate = {};
            stargazers.forEach(function(u) {
                var date = u.starred_at.substr(0, 10);
                groupByDate[date] = (groupByDate[date] || 0) + 1;
            });
            var formatDate = d3.time.format("%Y-%M-%d");
            groupByDate = Object.keys(groupByDate).map(function(d) {
                return {
                    date: formatDate.parse(d),
                    count: groupByDate[d]
                }
            });

            var margin = {top: 20, right: 20, bottom: 30, left: 50},
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;


            var x = d3.time.scale()
                .range([0, width]);

            var y = d3.scale.linear()
                .range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            var line = d3.svg.line()
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.count); });

            var svg = d3.select("body").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            x.domain(d3.extent(groupByDate, function(d) { return d.date; }));
            y.domain(d3.extent(groupByDate, function(d) { return d.count; }));

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Stars");

            svg.append("path")
                .datum(groupByDate)
                .attr("class", "line")
                .attr("d", line);

        });

        new Vue({
            el: 'body'
        });
    }
);
