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

    $(".list-photo-XXS").mousewheel(function(event, delta) {
        var position = parseInt($(this).css("left"));
        var width = parseInt($(this).outerWidth()) - parseInt($(this).parent().outerWidth());
        var slide = 500;
        if(position+slide*delta>0) slide = 0-position;
        if(position+slide*delta<-width) slide = width+position;
        if((position+slide*delta*2<-width) && (position+slide*delta>-width)) {
            var next = $(this).children().last().find("img").attr("data-next");
            if(next!=="undefined") getPhotos(next, false);
        }
        $(this).stop().animate({"left" : position+slide*delta}, 500);
    }); 

    $(document).on("click", ".list-item", function(){
        var direction = scrollgallery(this);
        var url = $(this).find("img").attr("data-l-src");
        var alt = $(this).find("img").attr("alt");
        togglenavigation(true);
        showPhoto(url, alt, direction);        
    });

    $(document).on("click", ".nav-right", function(){
        $(".galery-wrapper li.active").next().click();
    });

    $(document).on("click", ".nav-left", function(){
        $(".galery-wrapper li.active").prev().click();
    });

    $(document).on("mouseenter", window, function(){
        togglenavigation(true);
    });

    $(document).on("mouseleave", window, function(){
        togglenavigation(false);
    });

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

function showPhoto(url, alt, direction) {
    var target = $(".active-img");
    if(!direction) {
        $(".large-img-view").html('<img class="slide-img active-img" src="'+url+'" alt="'+alt+'" />');
    } else if(direction>0) {
        $(".large-img-view").append('<img class="slide-img next-img" src="'+url+'" alt="'+alt+'" />');
        $(".next-img").on("load", function() {
            target.animate({"left" : -500}, 100, function(){
                target.removeClass("active-img");
                target.addClass("prev-img");
                target.remove();
            });    
            var current = $(".next-img");
            var slide = (window.outerWidth-current.outerWidth())/2;
            current.animate({"right" : slide}, 100, function(){
                current.removeClass("next-img");
                current.css("right", "");
                current.addClass("active-img");
                target.remove();
            });            
        });        
    } else {
        $(".large-img-view").prepend('<img class="slide-img prev-img" src="'+url+'" alt="'+alt+'" />');
         $(".prev-img").on("load", function() {
            target.animate({"right" : -500}, 100, function(){
                target.removeClass("active-img");
                target.addClass("next-img");
                target.remove();
            });            
            var current = $(".prev-img");
            var slide = (window.outerWidth-current.outerWidth())/2;
            current.animate({"left" : slide}, 100, function(){
                current.removeClass("prev-img");
                current.css("left", "");
                current.addClass("active-img");                
            });            
        }); 
    }
    $(".slide-img").on("load", function(){
        var width = $(this).outerWidth();
        var height = $(this).outerHeight();
        $(this).css({"max-width":width+"px", "max-height":height+"px", "height":"100%"});
    });
}

function checkURL() {
    var url = document.location.href;
    var upd = (url.indexOf("imgId=")>0) ? url.slice(url.indexOf("imgId=")+6) : "";
    upd = (upd.indexOf("&")>0) ? upd.slice(0, upd.indexOf("&")) : upd;

    return upd;
}

function scrollgallery(active) {
    var prev_elem = $(".list-photo-XXS").find(".active");
    prev_elem.removeClass("active");
    var prev_index = $(".list-photo-XXS .list-item").index(prev_elem);
    $(active).addClass("active");
    var index = $(".list-photo-XXS .list-item").index(active);
    var li_width = $(".list-item").outerWidth()+parseInt($(".list-item").css("margin-left"))+parseInt($(".list-item").css("margin-right"));
    var ul_width = $(".list-photo-XXS li").size() * li_width;
    var wrapper_width = $(".list-photo-XXS").parent().outerWidth();
    var slide = Math.round((index+1)*li_width-wrapper_width/2-li_width/2);
    if(slide>0 && slide<ul_width-wrapper_width) $(".list-photo-XXS").animate({"left" : -slide}, 500);
    else if(slide<ul_width-wrapper_width) $(".list-photo-XXS").animate({"left" : 0}, 500);
    else $(".list-photo-XXS").animate({"left" : -(ul_width-wrapper_width)}, 500);

    return (prev_index>=0) ? index-prev_index : 0;
}

function togglenavigation(show) {
    var active = $(".galery-wrapper li.active");
    if(show) {
        active.prev().is(".list-item") ? $(".nav-left").removeClass("hidden") : $(".nav-left").addClass("hidden");
        active.next().is(".list-item") ? $(".nav-right").removeClass("hidden") : $(".nav-right").addClass("hidden");
    } else {
        $(".nav-left").addClass("hidden");
        $(".nav-right").addClass("hidden");
    }
}