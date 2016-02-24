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

function isEnglish() {
    return ($('#menu a[section=profile]').html() == "About");
}
function isHomePage() {
    return ($('#content').find('.section').length > 0);
}
$('#menu a').click(function() {
    var ss = $(this).attr('section');
    $.cookie('section', ss, { path: '/' });
    if(!isHomePage()) {
        if(isEnglish()) {
            $.cookie('locale', 'en', { path: '/' });
            $(location).attr('href', '/');
        } else {
            $.cookie('locale', 'cn', { path: '/' });
            $(location).attr('href', '/cn.html');
        }
    } else {
        $('#content').find('.section').hide();
        $('#content').find('.' + ss).show();
    }
});
$('a[locale]').click(function() {
    $.cookie('locale', $(this).attr('locale'), { path: '/' });
});

if(isHomePage()) {
    if(isEnglish() && $.cookie('locale') == 'cn') {
        $(location).attr('href', '/cn.html');
    }
    var ss = 'profile';
    if($.cookie('section') !== undefined) {
        ss = $.cookie('section');
    }
    $('#menu a[section=' + ss + ']').trigger('click');
} else {
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
}
