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
        function createTOC() {
            var heads = $("h1, h2, h3, h4, h5, h6").toArray(), lines = [], last = 0;

            for (var i = 0; i < heads.length; i++) {
                var level = parseInt(heads[i].tagName[1]);
                var indent = level - last;
                last = level;
                if (indent >= 0) {
                    for (var j = 0; j < indent; j++) {
                        lines.push("<ul>");
                    }
                    lines.push("<li>" + heads[i].innerHTML + "</li>");
                } else {
                    for (var j = 0; j < -indent; j++) {
                        lines.push("</ul>");
                    }
                    lines.push("<li>" + heads[i].innerHTML + "</li>");
                }
            }
            for (var j = 0; j < last; j++) {
                lines.push("</ul>");
            }

            if (heads.length > 1) {
                var html = lines.join("\n");
                $("#toc").html(html);
                $("#toc").find("li").each(function(i) {
                    var h = heads[i];
                    $(this).click(function() {
                        brook_ga('send', 'event', 'toc_click', window.location.href, $(this).text());
                        $('html, body').animate({
                            scrollTop: $(h).offset().top - $('div.navbar-fixed-top').height()
                        }, 500);
                    });
                });
            }
        }

        var navbar = new Navbar({});
        navbar.render();

        createTOC();

        $('a').click(function() {
            brook_ga('send', 'event', 'outbound', this.href, $(this).text());
        });
    }
);
