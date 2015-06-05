/*
 * Variables
 **/
var webServicesUrl = 'http://projectsunderdev.com/app-pdg/';

/*
 * Boton Volver Cerrar app.
 **/
deviceBackBtn();

/*! tocca v0.1.3 || Gianluca Guarini */
!function (a, b) {
    "use strict";
    if ("function" != typeof a.createEvent)
        return!1;
    var c, d, e, f, g, h, i = "undefined" != typeof jQuery, j = !!navigator.pointerEnabled || navigator.msPointerEnabled, k = !!("ontouchstart"in b) && navigator.userAgent.indexOf("PhantomJS") < 0 || j, l = function (a) {
        var b = a.toLowerCase(), c = "MS" + a;
        return navigator.msPointerEnabled ? c : b
    }, m = {touchstart: l("PointerDown") + " touchstart", touchend: l("PointerUp") + " touchend", touchmove: l("PointerMove") + " touchmove"}, n = function (a, b, c) {
        for (var d = b.split(" "), e = d.length; e--; )
            a.addEventListener(d[e], c, !1)
    }, o = function (a) {
        return a.targetTouches ? a.targetTouches[0] : a
    }, p = function () {
        return(new Date).getTime()
    }, q = function (b, e, f, g) {
        var h = a.createEvent("Event");
        if (g = g || {}, g.x = c, g.y = d, g.distance = g.distance, i)
            jQuery(b).trigger(e, g);
        else {
            h.originalEvent = f;
            for (var j in g)
                h[j] = g[j];
            h.initEvent(e, !0, !0), b.dispatchEvent(h)
        }
    }, r = function (a) {
        var b = o(a);
        e = c = b.pageX, f = d = b.pageY, h = p(), z++
    }, s = function (a) {
        var b = [], i = f - d, j = e - c;
        if (clearTimeout(g), -u >= j && b.push("swiperight"), j >= u && b.push("swipeleft"), -u >= i && b.push("swipedown"), i >= u && b.push("swipeup"), b.length)
            for (var k = 0; k < b.length; k++) {
                var l = b[k];
                q(a.target, l, a, {distance: {x: Math.abs(j), y: Math.abs(i)}})
            }
        else
            h + v - p() >= 0 && e >= c - x && c + x >= e && f >= d - x && d + x >= f && q(a.target, 2 === z ? "dbltap" : "tap", a), g = setTimeout(function () {
                z = 0
            }, w)
    }, t = function (a) {
        var b = o(a);
        c = b.pageX, d = b.pageY
    }, u = b.SWIPE_THRESHOLD || 100, v = b.TAP_THRESHOLD || 150, w = b.DBL_TAP_THRESHOLD || 200, x = b.TAP_PRECISION / 2 || 30, y = b.JUST_ON_TOUCH_DEVICES || k, z = 0;
    n(a, m.touchstart + (y ? "" : " mousedown"), r), n(a, m.touchend + (y ? "" : " mouseup"), s), n(a, m.touchmove + (y ? "" : " mousemove"), t)
}(document, window);

$(function () {
    $('#menu li a').on('touchend', function (e) {
        window.location.href = $(this).attr('href');
    })
})

function setHeights(header) {

    var hasHeader = header || 0;

    var $cont = $('.container');
    //var contH = winH - 32; // Fix padding container
    //
    //if(hasHeader){
    //    setTimeout(function(){
    //        var headH = $('.ui-header').height();
    //        contH -= headH;
    //        $cont.css('min-height', contH);
    //    },200);
    //}
    //
    //if(contH < 500){
    //    contH = 500;
    //}

    //$cont.css('min-height', '100%');
}

function is_logged() {
    var logged = $.isEmptyObject(localStorage.getItem("userID"));

    if (($('#loginPage').length == 0) && logged) {
        window.location.href = "login.html";
    } else {
        return 1;
    }
}

function showError(msg, er) { // 'vaciar' para resetear campo, 'er' para ocultar cruz de error.
    var error = er || 0;
    if (error) {
        $('.errors img').hide();
    } else {
        $('.errors img').show();
    }

    if (msg == 'vaciar') {
        $('.errors').hide();
        $('.errors p').text('Usuario o contraseña incorrectos');
    } else {
        $('.errors').fadeIn();
        $('.errors p').text(msg);
    }
}

function menuCreator() {

    //var menu = $('#menu').slicknav({
    //    prependTo:'.ui-header',
    //    init: function () {
    //        $('.slicknav_btn').html('');
    //    }
    //});

    if ($('.ui-header').length > 0) {
        //$('.container[role=main]').css('margin-top','60px');
    }

    $(document).on('touchend', '.menuBtn', function () {
        if ($('.slicknav_menu').hasClass('notShow')) {
            setTimeout(
                    function () {
                        $('#menu')
                                .css('-webkit-transform', 'translate3d(0,0,0)')
                                .css('-moz-transform', 'translate3d(0,0,0)')
                                .css('-ms-transform', 'translate3d(0,0,0)')
                                .css('-o-transform', 'translate3d(0,0,0)')
                                .css('transform', 'translate3d(0,0,0)')
                    }, 50
                    )
            var $calc = $(window).height() - 60 * 7 - 17 - 30 //60*7 -> alto de li del menu * cantidad de li (item de menu, contando el username);
            $('#menu li.vSpace').css('height', $calc + 'px');
            $('.slicknav_menu').removeClass('notShow');
            $('#menu li .arrow').remove();
            $('#menu li').not('.username, .vSpace, .line').append('<div class="arrow"><i class="fa fa-chevron-right"></i></div>')
            $('#menu li.bottom .arrow').addClass('closeMenuBtn');
        }
    })

    var el = document.getElementById('pageHeader')
    swipedetect(el, function (swipedir) {
        if (swipedir == 'down') {
            setTimeout(
                    function () {
                        $('#menu')
                                .css('-webkit-transform', 'translate3d(0,0,0)')
                                .css('-moz-transform', 'translate3d(0,0,0)')
                                .css('-ms-transform', 'translate3d(0,0,0)')
                                .css('-o-transform', 'translate3d(0,0,0)')
                                .css('transform', 'translate3d(0,0,0)')
                    }, 50
                    )
            var $calc = $(window).height() - 60 * 7 - 17 - 30 //60*7 -> alto de li del menu * cantidad de li (item de menu, contando el username);
            $('#menu li.vSpace').css('height', $calc + 'px');
            $('.slicknav_menu').removeClass('notShow');
            $('#menu li .arrow').remove();
            $('#menu li').not('.username, .vSpace, .line').append('<div class="arrow"><i class="fa fa-chevron-right"></i></div>')
            $('#menu li.bottom .arrow').addClass('closeMenuBtn');
        }
    })

    var el = document.getElementById('menu')
    swipedetect(el, function (swipedir) {
        if (swipedir == 'up') {
            $('#menu')
                    .css('-webkit-transform', 'translate3d(0,-100%,0)')
                    .css('-moz-transform', 'translate3d(0,-100%,0)')
                    .css('-ms-transform', 'translate3d(0,-100%,0)')
                    .css('-o-transform', 'translate3d(0,-100%,0)')
                    .css('transform', 'translate3d(0,-100%,0)')
            $('.slicknav_menu').addClass('notShow');
            window.scrollTo(0, 0);
        }
    })

    $(document).on('touchend', '.arrow.closeMenuBtn', function () {
        $('#menu')
                .css('-webkit-transform', 'translate3d(0,-100%,0)')
                .css('-moz-transform', 'translate3d(0,-100%,0)')
                .css('-ms-transform', 'translate3d(0,-100%,0)')
                .css('-o-transform', 'translate3d(0,-100%,0)')
                .css('transform', 'translate3d(0,-100%,0)')
        $('.slicknav_menu').addClass('notShow');
        window.scrollTo(0, 0);
    })

    $('.slicknav_menu .btnExit').on('touchstart', function (e) {
        e.preventDefault();
        cerrarSesion();
        /*
        try {
            navigator.notification.confirm(
                    '¿Seguro deseas salir?', // message
                    onConfirm(), // callback to invoke with index of button pressed
                    'Cerrar Aplicación', // title
                    ['Cancelar', 'Salir'] // buttonLabels
                    );
        } catch (err) {
            var r = confirm('¿Seguro deseas salir?');
            if (r == true) {
                window.location.href = "login.html"
            }
        }
        */
    });
}


function cerrarSesion(){
    //try {
        navigator.notification.confirm(
                '¿Seguro deseas salir?', // message
                onConfirmLogout, // callback to invoke with index of button pressed
                'Cerrar Aplicación', // title
                ['Cancelar', 'Salir'] // buttonLabels
                );
        /*
    } catch (err) {
        var r = confirm('¿Seguro deseas salir?');
        if (r == true) {
            cleanSession();
        }
    }    
    */
}

function onConfirmLogout(buttonIndex) {
    if(buttonIndex == 2){
        cleanSession();
    }
}

function cleanSession(){
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "login.html";
}

function setjQueryUILang() {
    // Traducción al español
    $.datepicker.regional['es'] = {
        closeText: 'Cerrar',
        prevText: '<Ant',
        nextText: 'Sig>',
        currentText: 'Hoy',
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
        dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
        weekHeader: 'Sm',
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };
    $.datepicker.setDefaults($.datepicker.regional['es']);
}

function showMessage(text, btn) {

    var theText = text || 'No definido';
    var theBtn = btn || 'Aceptar';

    var popUp = '<div id="thePopUp">' +
            '<div class="popContainer">' +
            '<p>' + theText + '</p>' +
            '<p class="popClose">' + theBtn + '</p>' +
            '</div>' +
            '</div>';

    var page = $('div[role="main"]');

    page.append(popUp);

    openPopUp();

}

function openPopUp() {

    var popUp = $('#thePopUp');
    popUp.css('top', ($.mobile.activePage.height() / 2) - 150).fadeIn();

    popUp.find('.popClose').on('click', function () {
        popUp.remove();
    });

}

function getCampaigns() {
    var uID = localStorage.getItem('userID');
    $.ajax({
        url: webServicesUrl + "campaign.php",
        type: 'POST',
        data: {userID: uID},
        success: function (result) {
            var r = $.parseJSON(result);
            if (r.data && r.data.status && r.data.status == 'success') {
                var camps = r.data;
                delete camps.status;
                sessionStorage.setItem("campsID", JSON.stringify(camps));
            } else {
                showMessage(r.data.message);
            }
        },
        error: function (error) {
            console.log(JSON.stringify(error));
        }
    });
}

function setCampId(id) {
    sessionStorage.setItem("currentCamp", id);
}
function getCampId() {
    return sessionStorage.getItem("currentCamp");
}

function loadCampaignSelector() {
    var $select = $('.campaignSelector select');
    var camps = $.parseJSON(sessionStorage.getItem('campsID'));
    $('.campaignSelector select option').remove();


    $.each(camps, function (key, value) {
        if (key == 0) {
            $('#select-3-button span').text('Campaña ' + value.campaignID);
        }
        $select.append('<option data-campId="' + value.campaignID + '" value="' + value.campaignID + '">Campaña ' + value.campaignID + '</option>');
    });

    if ($('.campaignSelector select option').length == 1) {
        $('.campaignSelector').hide();
    }
}


function selectCampaignSelector(id) {
    var $select = $('.campaignSelector select');
    $('#select-3-button span').text('Campaña ' + id);

    $select.val(id)
}

function deviceBackBtn() {

    document.addEventListener("backbutton", function (e) {
        e.preventDefault();
        var exitApp = 0;
        if ($("#homePage.ui-page-active").length > 0) {
            exitApp = 1;
        } else if ($("#loginPage.ui-page-active").length > 0) {
            exitApp = 1;
        }

        if (exitApp) {
            cerrarSesion();
            /*
            navigator.notification.confirm(
                    '¿Seguro deseas salir?', // message
                    onConfirm, // callback to invoke with index of button pressed
                    'Cerrar Aplicación', // title
                    ['Cancelar', 'Salir'] // buttonLabels
                    );
                    */
        } else {
            navigator.app.backHistory();
        }
    }, false);
}

function onConfirm(buttonIndex) {
    if (buttonIndex == 2) {
        localStorage.removeItem('userID');
        sessionStorage.clear();
        navigator.app.exitApp();
        window.location.href = "login.html"
    }
}

function validateEmail(email) {
    var emailReg = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    var valid = emailReg.test(email);

    if (!valid) {
        return false;
    } else {
        return true;
    }
}

function swipedetect(el, callback) {

    var touchsurface = el,
            swipedir,
            startX,
            startY,
            distX,
            distY,
            threshold = 150, //required min distance traveled to be considered swipe
            restraint = 100, // maximum distance allowed at the same time in perpendicular direction
            allowedTime = 300, // maximum time allowed to travel that distance
            elapsedTime,
            startTime,
            handleswipe = callback || function (swipedir) {
            }
    try {
        touchsurface.addEventListener('touchstart', function (e) {
            var touchobj = e.changedTouches[0]
            swipedir = 'none'
            dist = 0
            startX = touchobj.pageX
            startY = touchobj.pageY
            startTime = new Date().getTime() // record time when finger first makes contact with surface
            e.preventDefault()
        }, false)

        touchsurface.addEventListener('touchmove', function (e) {
            e.preventDefault() // prevent scrolling when inside DIV
        }, false)

        touchsurface.addEventListener('touchend', function (e) {
            var touchobj = e.changedTouches[0]
            distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
            distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
            elapsedTime = new Date().getTime() - startTime // get time elapsed
            if (elapsedTime <= allowedTime) { // first condition for awipe met
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
                    swipedir = (distX < 0) ? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
                }
                else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
                    swipedir = (distY < 0) ? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
                }
            }
            handleswipe(swipedir)
            e.preventDefault()
        }, false)
    } catch (err) {
    }
}

$('a.home').on('touchstart', function () {
    window.location.href = 'home.html';
})
$(document).ready(function () {
    $('body').fadeIn('slow');
});

function reloadPage(url)
{
    $('body').fadeOut('fast', function () {
        window.location.href = url;
    });
}
