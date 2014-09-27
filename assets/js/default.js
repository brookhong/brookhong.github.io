$('#menu a').click(function() {
    var ss = $(this).attr('section');
    $.cookie('section', ss, { expires: 7, path: '/' });
    if($('#content').find('.section').length == 0) {
        var homeUrl = ($('#menu a[section=profile]').html() == "About") ? '/' : '/cn.html';
        $(location).attr('href', homeUrl);
    } else {
        $('#content').find('.section').hide();
        $('#content').find('.' + ss).show();
    }
});
if($('#content').find('.section').length) {
    var ss = 'profile';
    if($.cookie('section') !== undefined) {
        ss = $.cookie('section');
    }
    $('#menu a[section=' + ss + ']').trigger('click');
}

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
