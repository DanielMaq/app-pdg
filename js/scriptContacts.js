var contactos;
var currentCamp;
$('#contactPage').live( 'pageinit',function(event) {

    $('p.loader').show();

    setHeights(1);

    menuCreator();

    /* Asignarle el alto necesario al contenedor */
    var winH = $(window).height();
    var headH = $('.ui-header').height();


    loadCampaignSelector();

    var firstCamp = currentCamp = $('.campaignSelector select option:first-child').attr('data-campId');


    var cpId = localStorage.getItem('cid');
    if( !$.isEmptyObject(cpId) ){
        $('#select-3-button span').text('Campaña ' + cpId);
        $('.campaignSelector').val(cpId);
        firstCamp = currentCamp = cpId;
        localStorage.removeItem('cid');
    }

    getCampaingMsgs(currentCamp);

    $('.campaignSelector select').on('change', function(){
        var campId = currentCamp = $(this).find('option:selected').attr('data-campId');
        $('.results').hide();
        $('p.loader').show();
        getCampaingMsgs(campId);
    });

    $(document).on('click','.swiper-slide.contactInfo',function(){
        var msgId = $(this).parent().parent().attr('data-msgId');
        var campId = $(this).parent().parent().attr('data-campid');
        localStorage.setItem('cid', campId);
        localStorage.setItem('contacto', JSON.stringify(contactos[msgId]));
        window.location.href = "contactsDetail.html";
    })

    $(document).on('touchstart','.contactAction .action1',function(){
        var msgId = $(this).parent().parent().parent().attr('data-msgId');
        var campId = $(this).parent().parent().parent().attr('data-campid');
        localStorage.setItem('cid', campId)
        localStorage.setItem('contacto', JSON.stringify(contactos[msgId]))
        window.location.href = "contactsAnswer.html";
    })

    $('.showSelects').on('touchend',function(){
        if($(this).hasClass('notShow')){
            $('.campaignSelector').css('max-height','83px');
            setTimeout(function(){$('.showSelects').removeClass('notShow')},100)
        }else{
            $('.campaignSelector').css('max-height','0');
            setTimeout(function(){$('.showSelects').addClass('notShow')},100)
        }
    })

    $('#contactPage .tabs > li a').on('click',function(e){
        e.preventDefault();
        $('.tabs > li').removeClass('active');
        var tabToShow = $(this).attr('href');
        $('.contentTabs .results').removeClass('active');
        $('.tabs > li').removeClass('active');
        $(this).parent().addClass('active');
        $('#contactPage .contentTabs #'+tabToShow).addClass('active');
    });
});

var contactos = null;

function getCampaingMsgs(campId)
{
    var uID = localStorage.getItem('userID');
    var campID = campId;
    var page = 0;
    var ultimoID = getUltimoId(campId);
        $.ajax({
            url: webServicesUrl+"contact.php",
            type:'POST',
            async: true,
            data:{
                uID : uID,
                campID: campID,
                page: page,
                ultimoID: ultimoID
            },
            beforeSend: function(){

            },
            success: function (result) {
                var r = $.parseJSON(result);
                if (r.data && r.data.status && r.data.status == 'success' && r.data[0] != undefined) {
                    updateContactsLocalStorage(r.data, campId);
                }
            },
            error:function(error){
                //alert(JSON.stringify(error));
            },
            complete: function(){
                $('.results').empty();
                showContacts(campId);
                showNewContacts(campId);
                generateTabs()
                $('p.loader').hide();
                $('.results').show();
                $('.wrapperContent').show();
            }
        });
}

function getUltimoId(campId)
{
    var ultimoID;
    var ultimosID = localStorage.getItem('ultimoID');
    ultimosID = ultimosID != null ? JSON.parse(ultimosID) : [];
    for (var i = 0; i < ultimosID.length; i++) {
        if (ultimosID[i].campID == campId) {
            ultimoID = ultimosID[i].ultimoID;
        }
    }

    return ultimoID;
}

function updateContactsLocalStorage(data, campId)
{
    var keys = Object.keys(data);
    keys.pop();

    // actualizo el ultimoId para la campaña
    var ultimoContact = data[keys[0]];
    if (ultimoContact.contactID != undefined) {
        updateUltimoIdLocalStorage(campId, ultimoContact.contactID);
    }

    // agrego los nuevos contactos
    var contacts = [];
    for (var i = 0; i < keys.length; i++) {
        if (data[keys[i]]) {
            contacts[i] = data[keys[i]];
        }
    }

    // agrego los contactos guardados en localStorage
    var sLocalContacts = localStorage.getItem('contacts');
    var aLocalContacts = sLocalContacts != null ? JSON.parse(sLocalContacts) : [];
    var localContacts = [];
    var index = false;
    for (var i = 0; i < aLocalContacts.length; i++) {
        if (aLocalContacts[i] != undefined && aLocalContacts[i].campID == campId) {
            localContacts = aLocalContacts[i].data;
            index = i;
        }
    }

    for (var i = keys.length; i < localContacts.length; i++) {
        if (localContacts[i]) {
            contacts[i] = localContacts[i];
        }
    }

    if (!index) {
        var newContact = {};
        newContact.campID = campId;
        newContact.data = contacts;
        aLocalContacts.push(newContact);
    } else {
        aLocalContacts[index].data = contacts;
    }

    localStorage.setItem('contacts', JSON.stringify(aLocalContacts));
}

function updateUltimoIdLocalStorage(campId, contactID)
{
    var add = false;
    var lastContact = {};
    var ultimosID = localStorage.getItem('ultimoID');
    localStorage.setItem('old_ultimoID', ultimosID);

    ultimosID = ultimosID != null ? $.parseJSON(ultimosID) : [];
    if (ultimosID.length == 0) {
        lastContact.campID = campId;
        lastContact.ultimoID = contactID;
        ultimosID.push(lastContact);
        add = true;
    } else {
        for (var i = 0; i < ultimosID.length; i++) {
            if (ultimosID[i].campID == campId) {
                ultimosID[i].ultimoID = contactID;
                add = true;
            }
        }
    }

    if (!add) {
        lastContact.campID = campId;
        lastContact.ultimoID = contactID;
        ultimosID.push(lastContact);
    }

    localStorage.setItem('ultimoID', JSON.stringify(ultimosID));
}

function showContacts(campId)
{
    //Anchos para generar los swipes
    var winW = $(window).width();
    var psW = winW-80;
    var psiW = winW-160;
    var asW = winW;


    var $resultsContainer = $('.results.todos');
    var sLocalContacts = localStorage.getItem('contacts');
    var aLocalContacts = sLocalContacts != null ? JSON.parse(sLocalContacts) : [];
    contactos = null;
    for (var i = 0; i < 31; i++) {
        if (aLocalContacts[i] != undefined && aLocalContacts[i].campID == campId) {
            contactos = aLocalContacts[i].data;
        }
    }

    if (contactos == null) {
            $resultsContainer.html('<p class="noResults">No se han encontrado resultados.</p>');
    } else {
        var data = '<div class="listContact"><ul>';

        //for (var i = 0; i < contactos.length; i++) {
        for (var i = 0; i < 31; i++) {
            var contact = contactos[i];
            if (contact != null && contact.contactID != undefined) {
                var date = generateDate(contact.date); //obtenemos la fecha en el formato adecuado


                data += '<li data-msgId="'+i+'">';

                data += '<div class="swiper-container" data-snap-ignore="1" data-contactId="'+contact.contactID+'" data-campId="'+campId+'" data-msgId="'+i+'"><div class="swiper-wrapper">' //Abrimos swiper

                data += '<div class="swiper-slide contactInfo" style="width:'+psW+'px">' //1er slider -> contactInfo
                data += '<div class="info" style="width:'+psiW+'px;">' +
                        '<div class="name">'+contact.nombre+'</div>' +
                        '<div class="campaign">Campaña '+campId+', '+date+'</div>' +
                    '</div>'; // Contacto INFO --> Nombre, campaña y fecha
                data += '</div>' //cierre 1er slider

                data += '<div class="swiper-slide contactAction" style="width: '+asW+'px;">' + //2do slider -> contactInfo
                    '<div class="arrow" style=""><span class="circle"><i class="fa fa-angle-left"></i></span></div>' +
                    '<div class="action1" style="">Responder<span class="pencil"><i class="fa fa-pencil"></i></span></div>' +
                '</div>'

                data += '</div></div>'; //cierre swiper-container & swiper-wrapper

                //data += '<div class="msg"><p>'+contact.comentario+'</p></div>';
                data += '</li>';
            }
        }

        data += '</ul></div>';

        $resultsContainer.html(data);
    }

    createSwipes();
}

function showNewContacts(campId)
{

    //Anchos para generar los swipes
    var winW = $(window).width();
    var psW = winW-80;
    var psiW = winW-160;
    var asW = winW;


    var $resultsContainer = $('.results.nuevos');
    var sLocalContacts = localStorage.getItem('contacts');
    var aLocalContacts = sLocalContacts != null ? JSON.parse(sLocalContacts) : [];
    contactos = null;
    for (var i = 0; i < aLocalContacts.length; i++) {
        if (aLocalContacts[i] != undefined && aLocalContacts[i].campID == campId) {
            contactos = aLocalContacts[i].data;
        }
    }

    var ultimoID = null;
    var ultimosID = localStorage.getItem('old_ultimoID');
    ultimosID = ultimosID != 'null' ? $.parseJSON(ultimosID) : [];
    if (ultimosID.length != 0) {
        for (var i = 0; i < ultimosID.length; i++) {
            if (ultimosID[i].campID == campId) {
                ultimoID = ultimosID[i].ultimoID;
                break;
            }
        }
    }

    if (contactos == null) {
        $resultsContainer.html('<p class="noResults">No se han encontrado resultados.</p>');
    } else {
        var data = '<div class="listContact"><ul>';

        for (var i = 0; i < 31; i++) {
            var contact = contactos[i];

            if (contact != null && contact.contactID != undefined && contact.contactID >= ultimoID) {
                var date = generateDate(contact.date); //obtenemos la fecha en el formato adecuado


                data += '<li data-msgId="'+i+'">';

                data += '<div class="swiper-container" data-snap-ignore="1" data-contactId="'+contact.contactID+'" data-campId="'+campId+'" data-msgId="'+i+'"><div class="swiper-wrapper">' //Abrimos swiper

                data += '<div class="swiper-slide contactInfo" style="width:'+psW+'px">' //1er slider -> contactInfo
                data += '<div class="info" style="width:'+psiW+'px;">' +
                '<div class="name">'+contact.nombre+'</div>' +
                '<div class="campaign">Campaña '+campId+', '+date+'</div>' +
                '</div>'; // Contacto INFO --> Nombre, campaña y fecha
                data += '</div>' //cierre 1er slider

                data += '<div class="swiper-slide contactAction" style="width: '+asW+'px;">' + //2do slider -> contactInfo
                '<div class="arrow" style=""><span class="circle"><i class="fa fa-angle-left"></i></span></div>' +
                '<div class="action1" style="">Responder<span class="pencil"><i class="fa fa-pencil"></i></span></div>' +
                '</div>'

                data += '</div></div>'; //cierre swiper-container & swiper-wrapper

                //data += '<div class="msg"><p>'+contact.comentario+'</p></div>';
                data += '</li>';
            }
        }

        data += '</ul></div>';
        $resultsContainer.html(data);
    }
    createSwipes()
}

function parseDate($date)
{
    var date = new Date($date.replace(' ', 'T'));
    var months = {0: 'Ene', 1: 'Feb', 2: 'Mar', 3: 'Abr', 4: 'May', 5: 'Jun', 6: 'Jul', 7: 'Ago', 8: 'Sep', 9: 'Oct', 10: 'Nov', 11: 'Dic'};
    var pieces = $date.split(' ');
    var time = pieces[1];

    return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear() + ' - ' + time;
}

function generateTabs(){
        $('#contactPage .container').addClass('show')
        ////$('#contactPage .tabs > li a').on('click',function(e){e.preventDefault()})
        //$('#contactPage .tabs > li a').on('touchstart',function(e){e.preventDefault()})
}

function createSwipes(){
    // Create swippper
    var listadiv = $('.swiper-container');
    $.each(listadiv, function (){
        var mySwiper = new Swiper(this,{
            slidesPerView: 'auto',
            calculateHeight: true,
            width: '100%'
        });
    });
}

function generateDate(date){
    var newDate = date.split(' ');
    newDate = newDate[0].split('-');
    newDate = newDate[2] + '/' + newDate[1] + '/' + newDate[0];
    return newDate;
}

window.onload = function() {
    $(".wrapperContent").pullToRefresh({
        lockRefresh: true
    });
    $(".wrapperContent").on("refresh.pulltorefresh", function (e, p){
        $('.loader').show();
        $('.wrapperContent').hide();
        getCampaingMsgs(currentCamp)
    })
};