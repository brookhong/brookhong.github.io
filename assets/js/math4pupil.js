require.config({
    paths : {
        "jquery" : "/assets/lib/jquery.min",
        "jquery-cookie" : "/assets/lib/jquery.cookie",
        "bootstrap" : "/assets/lib/bootstrap/bootstrap.min",
        "underscore" : "/assets/lib/underscore-min",
        "backbone" : "/assets/lib/backbone-min",
        "text" : "/assets/lib/text"
    },
    shim: {
        "bootstrap" : ["jquery"]
    }
});
require(
    [
        'backbone',
        'underscore',
        'locale',
        'navbar',
        'ga'
    ],
    function(Backbone, _, localeData, Navbar) {
        var navbar = new Navbar({});
        navbar.render();

        var math4Pupil = new (Backbone.View.extend({
            el: $('#mathContent'),
            navTemplate: _.template($("#math-content-template").html()),
            events: {
                "keydown input": function(e) {
                    if (e.which === 13 || e.which === 9) {
                        var br = e.currentTarget.getBoundingClientRect();
                        this.data.answer = e.currentTarget.value;
                        var result = { exp: JSON.parse(JSON.stringify(this.data)) };
                        if (e.currentTarget.value === this.data.expected) {
                            result.credit = 1;
                            document.querySelector("audio").play();
                        } else {
                            result.credit = -1;
                            e.currentTarget.focus();
                            $(e.currentTarget).val("");
                        }
                        this.credit({
                            left: br.left,
                            top: br.top
                        }, result.credit);
                        mathResult.trigger('change', result);
                        e.preventDefault();
                        e.stopImmediatePropagation();
                    }
                }
            },
            generateOperator: function() {
                var operators = ["+", "-"];
                return operators[Math.floor(Math.random()*100%operators.length)];
            },
            generate: function() {
                var negativeResult = false;
                var data = {};
                while (data.expected === undefined) {
                    data.para1 = Math.ceil(Math.random()*100%20);
                    data.para2 = Math.ceil(Math.random()*100%20);
                    data.operator1 = this.generateOperator();
                    data.expected = eval(data.para1 + data.operator1 + data.para2) + "";
                    if (negativeResult || data.expected >= 0) {
                        break;
                    } else {
                        data.expected = undefined;
                    }
                }
                return data;
            },
            credit: function(pos, flag) {
                var cf = $('#creditFace');
                var tp = flag > 0 ? $("div.success") : $("div.failure");
                cf.html(flag > 0 ? "😁" : "😢").show();
                cf.css("opacity", 1);
                cf.css("top", pos.top);
                cf.css("left", pos.left);
                tp = tp.offset();
                cf.animate({
                    opacity: 0.08,
                    left: tp.left,
                    top: tp.top
                }, 500, function() {
                    cf.hide();
                    if (flag > 0) {
                        math4Pupil.render();
                    }
                });
            },
            render: function() {
                this.data = this.generate();
                this.$el.html(this.navTemplate(this.data));
                this.$el.find('input').focus();
            }

        }));

        math4Pupil.render();

        var mathResult = new Backbone.Model({
            success: 0,
            failure: 0,
            failedTests: []
        });
        mathResult.on('change', function(data) {
            if (data.credit > 0) {
                this.attributes.success ++;
            } else {
                this.attributes.failure ++;
                this.attributes.failedTests.push(data.exp);
            }
        });

        var mathResultView = new (Backbone.View.extend({
            model: mathResult,
            el: $('#mathResult'),
            events: {
                "click div.failure>span": function(e) {
                    this.$el.find('div.failedTests').toggle();
                }
            },
            _template: _.template($("#math-result-template").html()),
            initialize: function(){
                this.listenTo(this.model, 'change', this.render);
            },
            render: function() {
                this.$el.html(this._template(this.model.attributes));
            }
        }));

        mathResultView.render();
    }
);
