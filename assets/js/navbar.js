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

define(
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

        return Navbar;
    }
);
