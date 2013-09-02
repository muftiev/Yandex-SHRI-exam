jQuery(document).ready(function($){

    $("#yandex-galery").yandex_galery();    

});

jQuery.fn.yandex_galery = function() {

    var target = $(this),
        galerywrapper = $("<div/>")
            .addClass("galery-wrapper")
            .appendTo(target),
        listphotoXXS = $("<ul/>")
            .addClass("list-photo-XXS")
            .appendTo(galerywrapper),
        loader = $("<div/>")
            .attr("id", "loader")
            .appendTo(target),
        slidewrapper = $("<div/>")
            .addClass("slide-wrapper")
            .prependTo(target),
        largeimgwrapper = $("<div/>")
            .addClass("large-img-wrapper")
            .appendTo(slidewrapper);

    $("<div/>")
        .addClass("large-img-view")
        .appendTo(largeimgwrapper);
    $("<button/>")
        .addClass("nav nav-left hidden")
        .appendTo(largeimgwrapper);
    $("<button/>")
        .addClass("nav nav-right hidden")
        .appendTo(largeimgwrapper);
    $("<img/>")
        .attr("src", "images/load.gif")
        .attr("alt", "loading")
        .appendTo(loader);

    var url = "http://api-fotki.yandex.ru/api/users/aig1001/album/63684/photos/?format=json&limit=30",
        upd = checkURL();

    getPhotos(url, true);

    listphotoXXS.mousewheel(function(event, delta) {
        var position = parseInt($(this).css("left")),
            width = parseInt($(this).outerWidth()) - parseInt($(this).parent().outerWidth()),
            slide = 500;

        //if(position+slide*delta>0) slide = 0-position;
        slide = (position+slide*delta>0)? 0-position : slide;
        //if(position+slide*delta<-width) slide = width+position;
        slide = (position+slide*delta<-width)? width+position : slide;
        if((position+slide*delta*2<-width) && (position+slide*delta>-width)) {
            var next = $(this).children().last().find("img").attr("data-next");
            if(next!=="undefined") getPhotos(next, false);
        }
        $(this).stop().animate({"left" : position+slide*delta}, 500);
    }); 

    $(document).on("click", ".list-item", function(){
        var direction = scrollgallery(this),
            url = $(this).find("img").attr("data-l-src"),
            alt = $(this).find("img").attr("alt");

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
            var limit = data.entries.length,
                listphotoXXS = $(".list-photo-XXS"),
                listitem = listphotoXXS.find(".list-item"),
                li_width = listitem.outerWidth()+parseInt(listitem.css("margin-left"))+parseInt(listitem.css("margin-right")),
                ul_width = (listitem.size() + limit) * li_width;

            for(var i=0; i<limit; i++){ 
                var listitemlink = $("<a/>")
                        .addClass("list-item-link")
                        .attr("href", "#?imgId="+data.entries[i].updated),
                    listphotoXXSitemimg = $("<img/>")
                        .addClass("list-photo-XXS-item-img")
                        .attr("data-upd", data.entries[i].updated)
                        .attr("data-L-src", data.entries[i].img.L.href)
                        .attr("src", data.entries[i].img.XXS.href)
                        .attr("alt", data.entries[i].title)
                        //.attr("data-next", data_next)
                        .appendTo(listitemlink);

                if(i==limit-1) listphotoXXSitemimg.attr("data-next", data.links.next);
                $("<li/>")
                    .addClass("list-item")
                    .append(listitemlink)
                    .appendTo(listphotoXXS);
            }

            var listitem = listphotoXXS.find(".list-item"),
                li_width = listitem.outerWidth()+parseInt(listitem.css("margin-left"))+parseInt(listitem.css("margin-right")),
                ul_width = listitem.size() * li_width;

            listphotoXXS.css("width", ul_width);
        },
        complete: function(){
            $("#loader").hide();
            if(first) {
                var upd = checkURL(),
                    curphoto = (upd.length>0) ? $('[data-upd="'+upd+'"]').parents().eq(1) : $(".list-photo-XXS .list-item:first-child");

                curphoto.click();
            }
        }
    });
}

function showPhoto(url, alt, direction) {
    var target = $(".active-img"),
        largeimgview = $(".large-img-view");

    if(!direction) {        
        var slideimg = $("<img/>")
            .addClass("slide-img active-img")
            .attr("src", url)
            .attr("alt", alt);

        largeimgview.html(slideimg);
    } else if(direction>0) {
        //largeimgview.append('<img class="slide-img next-img" src="'+url+'" alt="'+alt+'" />');
        $("<img/>")
            .addClass("slide-img next-img")
            .attr("src", url)
            .attr("alt", alt)
            .appendTo(largeimgview);

        $(".next-img").on("load", function() {
            target.animate({"left" : -500}, 100, function(){
                target.removeClass("active-img")
                    .addClass("prev-img")
                    .remove();
            });    
            var current = $(".next-img"),
                slide = (window.outerWidth-current.outerWidth())/2;

            current.animate({"right" : slide}, 100, function(){
                current.removeClass("next-img")
                    .css("right", "")
                    .addClass("active-img");
                target.remove();
            });            
        });        
    } else {
        //largeimgview.prepend('<img class="slide-img prev-img" src="'+url+'" alt="'+alt+'" />');
        $("<img/>")
            .addClass("slide-img prev-img")
            .attr("src", url)
            .attr("alt", alt)
            .prependTo(largeimgview);

         $(".prev-img").on("load", function() {
            target.animate({"right" : -500}, 100, function(){
                target.removeClass("active-img")
                    .addClass("next-img")
                    .remove();
            });            
            var current = $(".prev-img"),
                slide = (window.outerWidth-current.outerWidth())/2;

            current.animate({"left" : slide}, 100, function(){
                current.removeClass("prev-img")
                    .css("left", "")
                    .addClass("active-img");                
            });            
        }); 
    }
    $(".slide-img").on("load", function(){
            var width = $(this).outerWidth(),
                height = $(this).outerHeight();

        $(this).css({"max-width":width, "max-height":height, "height":"100%"});
    });
}

function checkURL() {
    var url = document.location.href,
        upd = (url.indexOf("imgId=")>0) ? url.slice(url.indexOf("imgId=")+6) : "";

    upd = (upd.indexOf("&")>0) ? upd.slice(0, upd.indexOf("&")) : upd;

    return upd;
}

function scrollgallery(active) {
    var listphotoXXS = $(".list-photo-XXS"),
        listitems = listphotoXXS.find(".list-item"),
        prev_elem = listphotoXXS.find(".active"),
        prev_index = listitems.index(prev_elem),
        index = listitems.index(active),
        li_width = listitems.outerWidth()+parseInt(listitems.css("margin-left"))+parseInt(listitems.css("margin-right")),
        ul_width = listitems.size() * li_width,
        wrapper_width = listphotoXXS.parent().outerWidth(),
        slide = Math.round((index+1)*li_width-wrapper_width/2-li_width/2);

    prev_elem.removeClass("active");
     $(active).addClass("active");
    if(slide>0 && slide<ul_width-wrapper_width) listphotoXXS.animate({"left" : -slide}, 500);
    else if(slide<ul_width-wrapper_width) listphotoXXS.animate({"left" : 0}, 500);
    else listphotoXXS.animate({"left" : -(ul_width-wrapper_width)}, 500);

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