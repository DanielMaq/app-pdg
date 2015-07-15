var contactos = null;
var currentCamp;
var paginator = 30;
var itemreload = paginator;

$('#contactPage').live( 'pageinit',function() {
    $('p.loader').show();

    setHeights(1);

    menuCreator();

    /* Asignarle el alto necesario al contenedor */
    loadCampaignSelector();

    currentCamp = getCampId();
    if (!currentCamp)
    {
        if(window.location.hash) {
            currentCamp = window.location.hash.substring(1);
        } else {
            currentCamp = $('.campaignSelector select option:first-child').attr('data-campId');
        }
        setCampId(currentCamp);
    }
    selectCampaignSelector(currentCamp);
    if (currentCamp == 'Todas')
    {
        /* Traemos todas las campañas y llamamos a todos sus mensajes */
        getAllMsgs();
    } else {
        getCampaingMsgs(currentCamp);
    }
    

    $('.campaignSelector select').on('change', function(){
        setCampId($(this).find('option:selected').attr('data-campId'));
        window.location.href = "contacts.html";
    });

    $(document).on('click','.swiper-slide.contactInfo',function(){
        var msgId = $(this).parent().parent().attr('data-msgId');
        var campId = $(this).parent().parent().attr('data-campid');
        localStorage.setItem('cid', campId);
        localStorage.setItem('contacto', JSON.stringify(contactos[msgId]));
        window.location.href = "contactsDetail.html";
    });

    $(document).on('touchstart','.contactAction .action1',function(){
        var msgId = $(this).parent().parent().parent().attr('data-msgId');
        var campId = $(this).parent().parent().parent().attr('data-campid');
        localStorage.setItem('cid', campId);
        localStorage.setItem('contacto', JSON.stringify(contactos[msgId]));
        window.location.href = "contactsAnswer.html";
    });

    $('.showSelects').on('touchend',function(){
        if($(this).hasClass('notShow')){
            $('.campaignSelector').css('max-height','83px');
            setTimeout(function(){$('.showSelects').removeClass('notShow');},100);

        }else{
            $('.campaignSelector').css('max-height','0');
            setTimeout(function(){$('.showSelects').addClass('notShow')},100)
        }

        setTimeout(function(){calcHeightDinamic();},700)
    });
    var supportsOrientationChange = "onorientationchange" in window,
        orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
    window.addEventListener(orientationEvent, function() {
        calcHeightDinamic();
    }, false);

    calcHeightDinamic();
    
    
    
    $('.container').on('scroll', function (){
        var total = $('.container')[0].scrollHeight - $('.container').scrollTop() - $('.container').height();
        if (total < 10) reload();
    });
    
    
});

function calcHeightDinamic (){
    var $calc = $(window).height() - $('.campaignSelector').height() - 60;
    $('.container[role=main]').height($calc)
}


/**
 *
 * @param campId
 * @returns {*}
 */
function getUltimoId(campId) {
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

/**
 *
 * @param $date
 * @returns {string}
 */
function parseDate($date) {
    var date = new Date($date.replace(' ', 'T'));
    var months = {0: 'Ene', 1: 'Feb', 2: 'Mar', 3: 'Abr', 4: 'May', 5: 'Jun', 6: 'Jul', 7: 'Ago', 8: 'Sep', 9: 'Oct', 10: 'Nov', 11: 'Dic'};
    var pieces = $date.split(' ');
    var time = pieces[1];

    return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear() + ' - ' + time;
}

/**
 *
 * @param campId
 * @param isNew
 */
function showContacts(campId, isNew) {
    var desde = 0;
    var hasta = itemreload;

    //Anchos para generar los swipes
    var winW = $(window).width();
    var psW = winW-80;
    var psiW = winW-160;
    var asW = winW;

    // Contenedor de resultados
    var $resultsContainer = $('.results');
    var sLocalContacts = localStorage.getItem('newscontacts');
    var aLocalContacts = sLocalContacts != null ? JSON.parse(sLocalContacts) : [];

    contactos = null;
    for (var i = 0; i < aLocalContacts.length; i++) {
        if (aLocalContacts[i] != undefined && aLocalContacts[i].campID == campId) {
            contactos = aLocalContacts[i].data;
        }
    }

    // Si son registros nuevos mover el puntero de ultimo ID
    if (isNew && contactos) {
        var ultimoID = null;
        var ultimosID = localStorage.getItem('old_ultimoID');
        ultimosID = ultimosID ? $.parseJSON(ultimosID) : [];

        if (ultimosID) {
            for (var i = 0; i < ultimosID.length; i++) {
                if (ultimosID[i].campID == campId) {
                    ultimoID = ultimosID[i].ultimoID;
                    break;
                }
            }
        }
    }

    if (contactos == null) {
        $resultsContainer.html('<p class="noResults">No se han encontrado resultados.</p>');
    } else {
        var data = '<div class="listContact"><ul>';

        var msgStatuses = localStorage.getItem('messagesStatus');
        msgStatuses = msgStatuses != null ? JSON.parse(msgStatuses) : [];

        //var to = isNew ? (contactos.length <= 30 ? contactos.length : 30) : contactos.length;
        
        var ini = (itemreload - paginator);
        var to = (contactos.length <= itemreload ? contactos.length : itemreload);
        for (var i = ini; i < to; i++) {
            var contact = contactos[i];

            if (contact != null && contact.contactID != undefined) {
                var date = generateDate(contact.date); //obtenemos la fecha en el formato adecuado
                var isRead = (!in_array(contact.contactID, msgStatuses)) ? '' : 'read';
                data += '<li data-msgId="'+i+'">';

                data += '<div class="swiper-container '+ isRead +'" data-snap-ignore="1" data-contactId="'+contact.contactID+'" data-campId="'+campId+'" data-msgId="'+i+'">';
                data += '<div class="swiper-wrapper">' //Abrimos swiper

                data += '<div class="swiper-slide contactInfo" style="width:'+psW+'px">' //1er slider -> contactInfo
                data += '<div class="info" style="width:'+psiW+'px;">' +
                '<div class="name">'+capitalizeFirstLetter(contact.nombre)+' '+capitalizeFirstLetter(contact.apellido)+'</div>' +
                '<div class="campaign">Campaña '+campId+', '+date+'</div>' +
                '</div>'; // Contacto INFO --> Nombre, campaña y fecha
                data += '</div>' //cierre 1er slider

                data += '<div class="swiper-slide contactAction" style="width: '+asW+'px;">' + //2do slider -> contactInfo
                '<div class="arrow" style=""><span class="circle"><i class="fa fa-angle-left"></i></span></div>' +
                '<div class="action1" style="">Responder<span class="pencil"><i class="fa fa-pencil"></i></span></div>' +
                '</div>';
                data += '</div></div>'; //cierre swiper-container & swiper-wrapper
                data += '</li>';
            }
        }

        data += '</ul></div>';
        $resultsContainer.append(data);
    }
    createSwipes()
}


/**
 *
 * @param campId
 * @param isNew
 */
function showAllContacts(isNew) {
    
    var desde = 0;
    var hasta = itemreload;
    
    
    //Anchos para generar los swipes
    var winW = $(window).width();
    var psW = winW-80;
    var psiW = winW-160;
    var asW = winW;

    var _localMsgs = (isNew ? 'allmsgs_news' : 'allmsgs');

    // Contenedor de resultados
    var $resultsContainer = $('.results');
    var sLocalContacts = localStorage.getItem(_localMsgs);
    //var aLocalContacts = sLocalContacts != null ? JSON.parse(sLocalContacts) : [];

    contactos = JSON.parse(sLocalContacts);

    if (contactos == null) {
        $resultsContainer.html('<p class="noResults">No se han encontrado resultados.</p>');
    } else {
        var data = '<div class="listContact"><ul>';

        var msgStatuses = localStorage.getItem('messagesStatus');
        msgStatuses = msgStatuses != null ? JSON.parse(msgStatuses) : [];


        var ini = (itemreload - paginator);
        var to = itemreload;
        $.each(contactos, function (key, value) {
            var i = key;
            if (key >= ini && key < to) {
                var contact = value;

                if (key == 0)
                {
                    localStorage.setItem('setallultimo', contact.contactID);
                }

                if (contact != null && contact.contactID != undefined) {
                    var date = generateDate(contact.date); //obtenemos la fecha en el formato adecuado
                    var isRead = (!in_array(contact.contactID, msgStatuses)) ? '' : 'read';
                    data += '<li data-msgId="'+i+'">';

                    data += '<div class="swiper-container '+ isRead +'" data-snap-ignore="1" data-contactId="'+contact.contactID+'" data-msgId="'+i+'">';
                    data += '<div class="swiper-wrapper">' //Abrimos swiper

                    data += '<div class="swiper-slide contactInfo" style="width:'+psW+'px">' //1er slider -> contactInfo
                    data += '<div class="info" style="width:'+psiW+'px;">' +
                    '<div class="name">'+capitalizeFirstLetter(contact.nombre)+' '+capitalizeFirstLetter(contact.apellido)+'</div>' +
                    '<div class="campaign">Campaña '+contact.campaignID+', '+date+'</div>' +
                    '</div>'; // Contacto INFO --> Nombre, campaña y fecha
                    data += '</div>' //cierre 1er slider

                    data += '<div class="swiper-slide contactAction" style="width: '+asW+'px;">' + //2do slider -> contactInfo
                    '<div class="arrow" style=""><span class="circle"><i class="fa fa-angle-left"></i></span></div>' +
                    '<div class="action1" style="">Responder<span class="pencil"><i class="fa fa-pencil"></i></span></div>' +
                    '</div>';
                    data += '</div></div>'; //cierre swiper-container & swiper-wrapper
                    data += '</li>';
                }
            }
        });

        data += '</ul></div>';
        $resultsContainer.append(data);
    }
    createSwipes()

}


function reload(){
    itemreload = itemreload + paginator;

    if (currentCamp == 'Todas')
    {
        showAllContacts(pagenew);
    } else {
        showContacts(currentCamp, pagenew);
    }
    calcHeightDinamic();
}


/**
 *
 */
function createSwipes(){
    // Create swippper
    var listadiv = $('.swiper-container');
    $.each(listadiv, function (){
        var mySwiper = new Swiper(this,{
            direction: 'horizontal',
            slidesPerView: 'auto',
            calculateHeight: true,
            width: '100%'
        });
    });
    
    
    //$('.container')[0].scrollHeight
    
    
}

/**
 *
 * @param date
 * @returns {Array}
 */
function generateDate(date){
    var newDate = date.split(' ');
    newDate = newDate[0].split('-');
    newDate = newDate[2] + '/' + newDate[1] + '/' + newDate[0];
    return newDate;
}

/**
 *
 * @returns {*}
 */
function array_merge() {
  //  discuss at: http://phpjs.org/functions/array_merge/
  // original by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Nate
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //    input by: josh
  //   example 1: arr1 = {"color": "red", 0: 2, 1: 4}
  //   example 1: arr2 = {0: "a", 1: "b", "color": "green", "shape": "trapezoid", 2: 4}
  //   example 1: array_merge(arr1, arr2)
  //   returns 1: {"color": "green", 0: 2, 1: 4, 2: "a", 3: "b", "shape": "trapezoid", 4: 4}
  //   example 2: arr1 = []
  //   example 2: arr2 = {1: "data"}
  //   example 2: array_merge(arr1, arr2)
  //   returns 2: {0: "data"}

  var args = Array.prototype.slice.call(arguments),
    argl = args.length,
    arg,
    retObj = {},
    k = '',
    argil = 0,
    j = 0,
    i = 0,
    ct = 0,
    toStr = Object.prototype.toString,
    retArr = true;

  for (i = 0; i < argl; i++) {
    if (toStr.call(args[i]) !== '[object Array]') {
      retArr = false;
      break;
    }
  }

  if (retArr) {
    retArr = [];
    for (i = 0; i < argl; i++) {
      retArr = retArr.concat(args[i]);
    }
    return retArr;
  }

  for (i = 0, ct = 0; i < argl; i++) {
    arg = args[i];
    if (toStr.call(arg) === '[object Array]') {
      for (j = 0, argil = arg.length; j < argil; j++) {
        retObj[ct++] = arg[j];
      }
    } else {
      for (k in arg) {
        if (arg.hasOwnProperty(k)) {
          if (parseInt(k, 10) + '' === k) {
            retObj[ct++] = arg[k];
          } else {
            retObj[k] = arg[k];
          }
        }
      }
    }
  }
  return retObj;
}

/**
 *
 * @param needle
 * @param haystack
 * @param argStrict
 * @returns {*}
 */
function array_search(needle, haystack, argStrict) {
    //  discuss at: http://phpjs.org/functions/array_search/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //    input by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //  depends on: array
    //        test: skip
    //   example 1: array_search('zonneveld', {firstname: 'kevin', middle: 'van', surname: 'zonneveld'});
    //   returns 1: 'surname'
    //   example 2: ini_set('phpjs.return_phpjs_arrays', 'on');
    //   example 2: var ordered_arr = array({3:'value'}, {2:'value'}, {'a':'value'}, {'b':'value'});
    //   example 2: var key = array_search(/val/g, ordered_arr); // or var key = ordered_arr.search(/val/g);
    //   returns 2: '3'

    var strict = !! argStrict,
        key = '';

    if (haystack && typeof haystack === 'object' && haystack.change_key_case) {
        // Duck-type check for our own array()-created PHPJS_Array
        return haystack.search(needle, argStrict);
    }
    if (typeof needle === 'object' && needle.exec) {
        // Duck-type for RegExp
        if (!strict) {
            // Let's consider case sensitive searches as strict
            var flags = 'i' + (needle.global ? 'g' : '') +
                (needle.multiline ? 'm' : '') +
                    // sticky is FF only
                (needle.sticky ? 'y' : '');
            needle = new RegExp(needle.source, flags);
        }
        for (key in haystack) {
            if(haystack.hasOwnProperty(key)){
                if (needle.test(haystack[key])) {
                    return key;
                }
            }
        }
        return false;
    }

    for (key in haystack) {
        if(haystack.hasOwnProperty(key)){
            if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
                return key;
            }
        }
    }

    return false;
}


function in_array(needle, haystack, argStrict) {
    //  discuss at: http://phpjs.org/functions/in_array/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: vlado houba
    // improved by: Jonas Sciangula Street (Joni2Back)
    //    input by: Billy
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    //   example 1: in_array('van', ['Kevin', 'van', 'Zonneveld']);
    //   returns 1: true
    //   example 2: in_array('vlado', {0: 'Kevin', vlado: 'van', 1: 'Zonneveld'});
    //   returns 2: false
    //   example 3: in_array(1, ['1', '2', '3']);
    //   example 3: in_array(1, ['1', '2', '3'], false);
    //   returns 3: true
    //   returns 3: true
    //   example 4: in_array(1, ['1', '2', '3'], true);
    //   returns 4: false

    var key = '',
        strict = !! argStrict;

    //we prevent the double check (strict && arr[key] === ndl) || (!strict && arr[key] == ndl)
    //in just one for, in order to improve the performance
    //deciding wich type of comparation will do before walk array
    if (strict) {
        for (key in haystack) {
            if (haystack[key] === needle) {
                return true;
            }
        }
    } else {
        for (key in haystack) {
            if (haystack[key] == needle) {
                return true;
            }
        }
    }

    return false;
}

/**
 *
 * @param contactId
 */
function changeMsgReadStatus(contactId) {
    var msgStatuses = localStorage.getItem('messagesStatus');
    console.log(msgStatuses);
    msgStatuses = msgStatuses != null ? JSON.parse(msgStatuses) : [];
    if (!in_array(contactId, msgStatuses)) {
        msgStatuses.push(contactId);
    }

    localStorage.setItem('messagesStatus', JSON.stringify(msgStatuses));
}

function capitalizeFirstLetter(str) {
    try{
        var firstLetter = str.substr(0, 1);
        var theRest = str.substr(1);
        return firstLetter.toUpperCase() + theRest.toLowerCase();
    }catch(err){}
}