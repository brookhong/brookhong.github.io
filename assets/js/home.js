require.config({
    paths : {
        "jquery" : "/assets/lib/jquery.min",
        "jquery-cookie" : "/assets/lib/jquery.cookie",
        "underscore" : "/assets/lib/underscore-min",
        "backbone" : "/assets/lib/backbone-min",
        "text" : "/assets/lib/text"
    }
});
require(
    [
        'navbar',
        'ga'
    ],
    function(Navbar) {
        var navbar = new Navbar({});
        navbar.render();
    }
);
