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
        'navbar',
        'ga'
    ],
    function(Navbar, brook_ga) {
        var navbar = new Navbar({});
        navbar.render();

        $('h2,h3').each(function() {
            var h2 = this;
            if ($(h2).is(':visible')) {
                $("<li><a href='javascript:void(0);'>" + $(this).text() + "</a></li>").appendTo('#toc ul').click(function() {
                    brook_ga('send', 'event', 'toc_click', window.location.href, $(this).text());
                    $('html, body').animate({
                        scrollTop: $(h2).offset().top
                    }, 500);
                });
            }
        });
        $('a').click(function() {
            brook_ga('send', 'event', 'outbound', this.href, $(this).text());
        });
    }
);
