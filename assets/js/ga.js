define(
    [
        'jquery'
    ],
    function() {
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
        return brook_ga;
    }
);
