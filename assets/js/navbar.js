// create navbar with backbone
define(
    [
        'backbone',
        'underscore',
        'locale',
        'bootstrap',
        'jquery-cookie'
    ],
    function(Backbone, _, localeData) {
        var Navbar = Backbone.View.extend({
            el: $('#navbarWrapper'),
            navTemplate: _.template($("#navbar-template").html()),
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
