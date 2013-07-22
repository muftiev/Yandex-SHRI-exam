jQuery(document).ready(function($){

    $("#yandex-galery").yandex_galery();    

});

jQuery.fn.yandex_galery = function() {

    var target = $(this);
    var galeryblock = '<div class="galery-wrapper"><ul class="list-photo-XXS"></ul></div><div id="loader"><img src="images/load.gif" alt="loading" /></div>';
    var slideblock = '<div class="slide-wrapper"><div class="large-img-wrapper"><div class="large-img-view"></div><button class="nav nav-left hidden"></button><button class="nav nav-right hidden"></button></div></div>';
    $(target).append(slideblock).append(galeryblock);

    var url = "http://api-fotki.yandex.ru/api/users/aig1001/album/63684/photos/?format=json&limit=30";
    var upd = checkURL();    
    getPhotos(url, true);

};

function getPhotos(url, first){
    $.ajax({
        type: "GET",
        url: url,        
        dataType: "jsonp",
        beforeSend: function(){
            $("#loader").show();
        },
        success: function(data){
            var limit = data.entries.length;
            for(var i=0; i<limit; i++){ 
                var data_next = (i==limit-1 ? 'data-next="'+data.links.next+'"' : '');
                $(".list-photo-XXS").append('<li class="list-item"><a href="#?imgId='+data.entries[i].updated+'" class="list-item-link"><img class="list-photo-XXS-item-img" data-upd="'+data.entries[i].updated+'" data-L-src="'+data.entries[i].img.L.href+'" '+data_next+' src="'+data.entries[i].img.XXS.href+'" alt="'+data.entries[i].title+'" /></li>');
            }
            var li_width = $(".list-item").outerWidth()+parseInt($(".list-item").css("margin-left"))+parseInt($(".list-item").css("margin-right"));
            var ul_width = $(".list-photo-XXS li").size() * li_width;
            $(".list-photo-XXS").css("width", ul_width);
        },
        complete: function(){
            $("#loader").hide();
            if(first) {
                var upd = checkURL();
                var curphoto = (upd.length>0) ? $('[data-upd="'+upd+'"]').parents().eq(1) : $(".list-photo-XXS .list-item:first-child");
                curphoto.click();
            }
        }
    });
}

function checkURL() {
    var url = document.location.href;
    var upd = (url.indexOf("imgId=")>0) ? url.slice(url.indexOf("imgId=")+6) : "";
    upd = (upd.indexOf("&")>0) ? upd.slice(0, upd.indexOf("&")) : upd;

    return upd;
}