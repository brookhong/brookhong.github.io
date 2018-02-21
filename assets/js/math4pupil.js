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
            navTemplate: _.template($("#math-template").html()),
            events: {
                "keydown input": function(e) {
                    if (e.which === 13 || e.which === 32) {
                        if (e.currentTarget.value == this.data.expected) {
                            document.querySelector("audio").play();
                            this.render();
                        } else {
                            var sadFace = $('#sadFace');
                            sadFace.removeClass("slideOutRight");
                            var pos = $(e.currentTarget).offset();
                            sadFace.css('top', pos.top);
                            sadFace.css('left', pos.left);
                            sadFace.show();
                            sadFace.addClass("slideOutRight");
                            e.currentTarget.focus();
                            $(e.currentTarget).val("");
                        }
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
                    data.expected = eval(data.para1 + data.operator1 + data.para2);
                    if (negativeResult || data.expected >= 0) {
                        break;
                    } else {
                        data.expected = undefined;
                    }
                }
                return data;
            },
            render: function() {
                this.data = this.generate();
                this.$el.html(this.navTemplate(this.data));
                this.$el.find('input').focus();
            }

        }));

        math4Pupil.render();
    }
);
