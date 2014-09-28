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
        var homeUrl = isEnglish() ? '/' : '/cn.html';
        $(location).attr('href', homeUrl);
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

    var qrcode = new QRCode(document.getElementById("qrcode"), {
        width : 300,
        height : 300
    });
    $("#text").on("blur", function () {
        var elText = document.getElementById("text");
        if (elText.value) {
            qrcode.makeCode(elText.value);
        }
    });
}
