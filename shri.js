jQuery(document).ready(function($){

    $("#yandex-galery").yandex_galery();    

});

jQuery.fn.yandex_galery = function() {

    var target = $(this);
    var galeryblock = '<div class="galery-wrapper"><ul class="list-photo-XXS"></ul>';
    var slideblock = '<div class="slide-wrapper"><div class="large-img-wrapper"><div class="large-img-view"></div><button class="nav nav-left hidden"></button><button class="nav nav-right hidden"></button></div></div>';
    $(target).append(slideblock).append(galeryblock);

};