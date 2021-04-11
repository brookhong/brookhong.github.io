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
            var heads = document.querySelectorAll("h1, h2, h3, h4, h5, h6"), lines = [], last = 0;

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
                document.querySelector("#toc").innerHTML = html;
                document.querySelectorAll("#toc li").forEach(function(li, i) {
                    var h = heads[i];
                    li.onclick = function() {
                        brook_ga('send', 'event', 'toc_click', window.location.href, this.innerText);
                        document.scrollingElement.scrollTop += h.getBoundingClientRect().top - document.querySelector('nav.fixed-top').offsetHeight;
                    };
                });
            }
        }

        var navbar = new Navbar({});
        navbar.render();

        createTOC();

        document.querySelectorAll("a").forEach(function(a) {
            a.onclick = function() {
                brook_ga('send', 'event', 'outbound', this.href, this.innerText);
            };
        });

        var imgPopup = document.createElement("div");
        imgPopup.id = "imgPopup";
        imgPopup.style.display = "none";
        imgPopup.innerHTML = "<img />";
        document.body.append(imgPopup);

        document.querySelectorAll("#content img").forEach(function(img) {
            img.onclick = function(e) {
                imgPopup.querySelector('img').src = img.src;
                imgPopup.style.display = "";
            };
        });
        imgPopup.onclick = () => {
            imgPopup.style.display = "none";
        };
    }
);
