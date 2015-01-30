/*
 * Variables
 **/
var webServicesUrl = 'http://projectsunderdev.com/app-pdg/';

/*
* Boton Volver Cerrar app.
**/
deviceBackBtn();

function setHeights(header){

    var hasHeader = header || 0;

    var winH = $(window).height();
    var $cont = $('.container');
    var contH = winH - 32; // Fix padding container

    if(hasHeader){
        setTimeout(function(){
            var headH = $('.ui-header').height();
            contH -= headH;
            $cont.css('min-height', contH);
        },200);
    }

    if(contH < 500){
        contH = 500;
    }

    $cont.css('min-height', contH);
}

function is_logged(){
    var logged = $.isEmptyObject(localStorage.getItem("userID"));

    if( ($('#loginPage').length == 0) && logged ){
        window.location.href="login.html";
    }else{
        return 1;
    }
}

function showError(msg, er){ // 'vaciar' para resetear campo, 'er' para ocultar cruz de error.
    var error = er || 0;
    if(error){
        $('.errors img').hide();
    }else{
        $('.errors img').show();
    }

    if(msg == 'vaciar'){
        $('.errors').hide();
        $('.errors p').text('Usuario o contraseña incorrectos');
    }else{
        $('.errors').fadeIn();
        $('.errors p').text(msg);
    }
}

function menuCreator(){

    var snapper = new Snap({
        element: document.getElementById('snapContent'),
        disable: 'right',
        hyperextensible: false,
        touchToDrag: false
    });

    $('.ui-header .menuBtn').on('click', function(){
        if( snapper.state().state=="left" ){
            snapper.close();
        } else {
            snapper.open('left');
        }
    });

    $('.snap-drawer .blueBtn.active').on('click', function(e){
        e.preventDefault();
    });

    $('.snap-drawer .btnText').on('click', function(e){
        e.preventDefault();
        sessionStorage.clear();
        window.location.href="index.html";
    });

}

function setjQueryUILang(){
    // Traducción al español
    $.datepicker.regional['es'] = {
        closeText: 'Cerrar',
        prevText: '<Ant',
        nextText: 'Sig>',
        currentText: 'Hoy',
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
        dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
        weekHeader: 'Sm',
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };
    $.datepicker.setDefaults($.datepicker.regional['es']);
}

function showMessage(text, btn){

    var theText = text || 'No definido';
    var theBtn = btn || 'Aceptar';

    var popUp = '<div id="thePopUp">' +
            '<div class="popContainer">' +

                '<p>' + theText + '</p>'+

                '<p class="popClose">' + theBtn + '</p>'+

            '</div>'+
        '</div>';

    var page = $('div[role="main"]');

    page.append(popUp);

    openPopUp();

}

function openPopUp(){

    var popUp = $('#thePopUp');
    popUp.css('top',($.mobile.activePage.height()/2)-150 ).fadeIn();

    popUp.find('.popClose').on('click', function(){
        popUp.remove();
    });

}

function getCampaigns(){
    var uID = localStorage.getItem('userID');
    $.ajax({
        url: webServicesUrl+"campaign.php",
        type:'POST',
        data:{userID: uID},
        success:function(result){
            var r = $.parseJSON(result);
            if (r.data && r.data.status && r.data.status == 'success'){
                var camps = r.data;
                delete camps.status;
                sessionStorage.setItem("campsID", JSON.stringify(camps) );
            }else{
                showMessage(r.data.message);
            }
        },
        error:function(error){
            alert(JSON.stringify(error));
        }
    });
}

function loadCampaignSelector(){
    var $select = $('.campaignSelector select');
    var camps = $.parseJSON( sessionStorage.getItem('campsID') );
    $('.campaignSelector select option').remove();


    $.each( camps, function( key, value ) {
        if(key == 0){
            $('#select-3-button span').text('Campaña ' + value.campaignID);
        }
        $select.append('<option data-campId="'+ value.campaignID +'" value="'+ value.campaignID +'">Campaña '+ value.campaignID +'</option>');
    });

}

function deviceBackBtn(){

    document.addEventListener("backbutton", function(e){
        e.preventDefault();
        var exitApp = 0;
        if( $("#homePage.ui-page-active").length > 0 ){
            exitApp = 1;
        }else if( $("#loginPage.ui-page-active").length > 0 ){
            exitApp = 1;
        }

        if( exitApp ){
            navigator.notification.confirm(
                '¿Seguro deseas salir?', // message
                onConfirm, // callback to invoke with index of button pressed
                'Cerrar Aplicación', // title
                ['Cancelar','Salir'] // buttonLabels
            );
        }else{
            navigator.app.backHistory();
        }
    }, false);
}

function onConfirm(buttonIndex) {
    if(buttonIndex == 2){
        navigator.app.exitApp();
    }
}