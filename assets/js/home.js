define('locale', [], function() {
    return {
        "English": {
            home: "Home",
            about: "About",
            locale: "中文"
        },
        "中文": {
            home: "主页",
            about: "关于",
            locale: "English"
        }
    }
});

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
        'text!/assets/template/navbar.html',
        'bootstrap',
        'jquery-cookie'
    ],
    function(Backbone, _, localeData, tplNavbar) {
        var Navbar = Backbone.View.extend({
            el: $('#navbarWrapper'),
            navTemplate: _.template(tplNavbar),
            events: {
                "click #changeLocale": "changeLocale",
                "click a[section]": function(evt) {
                    var ss = $(evt.target).attr('section');
                    $.cookie('section', ss, { path: '/' });
                    if ($('#content').find('.section').length > 0) {
                        this.showContent();
                    } else {
                        window.location.href = '/';
                    }
                    this.$el.find('.navbar-nav>li').removeClass('active');
                    $(evt.target).closest('li').addClass('active');
                }
            },
            changeLocale: function(evt) {
                $.cookie('locale', $(evt.target).attr('locale'), { path: '/' });
                this.render();
            },
            showContent: function() {
                var ss = $.cookie('section') || "posts";
                var locale = $.cookie('locale') || "English";
                $('#content').find('.section').hide();
                $('#content').find('.' + ss + "." + locale).show();
            },
            render: function() {
                var locale = $.cookie('locale') || "English";
                locale = localeData[locale];
                locale.activeSection = $.cookie('section') || "posts";
                this.$el.html(this.navTemplate(locale));
                this.showContent();
            }
        });

        var navbar = new Navbar({});
        navbar.render();
    }
);


(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

function brook_ga() {
    if (window.location.origin === "https://brookhong.github.io") {
        ga.apply(ga, arguments);
    }
}
brook_ga('create', 'UA-64048030-1', 'auto');
brook_ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
