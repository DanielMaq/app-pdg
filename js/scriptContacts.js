var pagenew = true;

/**
 *
 * @param campId
 */
function getAllMsgs() {
    var uID = localStorage.getItem('userID');
    var page = 0;
    var ultimoID = localStorage.getItem('setallultimo');

    $.ajax({
        url: webServicesUrl+"contact.php",
        type:'POST',
        async: true,
        data:{
            uID : uID,
            page: page,
            ultimoID: ultimoID,
        },
        success: function (result) {
            var r = $.parseJSON(result);
            if (r.data && r.data.status && r.data.status == 'success' && r.data[0] != undefined) {
                var nuevos = r.data;

                var viejos = localStorage.getItem('allmsgs');
                viejos =  viejos != null ? JSON.parse(viejos) : [];
                var todos = array_merge(nuevos, viejos);
                localStorage.setItem('allmsgs', JSON.stringify(todos));
                localStorage.setItem('allmsgs_news', JSON.stringify(nuevos));
            }
        },
        complete: function(){
            $('.results').empty();
            showAllContacts(true);
            $('p.loader').hide();
            $('.results').show();
            $('.wrapperContent').show();
        }
    });
}




/**
 *
 * @param campId
 */
function getCampaingMsgs(campId) {
    try {

        var uID = localStorage.getItem('userID');
        var campID = campId;
        var page = 0;
        //var ultimoID = '136040';//getUltimoId(campId);
        var ultimoID = getUltimoId(campId);

        $.ajax({
            url: _webServicesUrl+"contact.php",
            type:'POST',
            async: true,
            data:{
                uID : uID,
                campID: campID,
                page: page,
                ultimoID: ultimoID
            },
            success: function (result) {
                var r = $.parseJSON(result);
                if (r.data && r.data.status && r.data.status == 'success' && r.data[0] != undefined) {
                    updateContactsLocalStorage(r.data, campId);
                }
            },
            complete: function(){
                $('.results').empty();
                showContacts(campId, true);
                $('p.loader').hide();
                $('.results').show();
                $('.wrapperContent').show();
            }
        });
    } catch (err){
        alert("Error de sistema: " + err.message);
    }
}

/**
 *
 * @param local
 * @param campId
 * @returns {boolean}
 */
function getIndiceDeCampania(local, campId){
    // Busco si tengo contactos guardados para esta campaña
    var sLocalContacts = localStorage.getItem(local);
    var aLocalContacts = sLocalContacts != null ? JSON.parse(sLocalContacts) : [];
    var localContacts = [];

    var index = false; // Esta es la posición de la campaña dentro del array de contactos

    // Busco todos los contactos de una campaña y lo pone en la variable "localContacts"
    for (var i = 0; i < aLocalContacts.length; i++) {
        if (aLocalContacts[i] != undefined && aLocalContacts[i].campID == campId) {
            localContacts = aLocalContacts[i].data;
            index = i;
        }
    }

    return index;
}

/**
 *
 * @param data Array con resultado de llamada AJAX
 * @param campId Id de campaña actual
 */
function updateContactsLocalStorage(data, campId) {
    var keys = Object.keys(data);
    keys.pop();

    // Actualizo el ultimoId para la campaña
    var ultimoContact = data[keys[0]];
    if (ultimoContact.contactID != undefined) {
        updateUltimoIdLocalStorage(campId, ultimoContact.contactID);
    }

    // agrego los nuevos contactos
    var contactsNuevos = [];
    var idsUnreadMsg = [];
    for (var i = 0; i < keys.length; i++) {
        if (data[keys[i]]) {
            contactsNuevos[i] = data[keys[i]];
            //idsUnreadMsg.push(data[keys[i]].contactID);
        }
    }

    // Obtenemos el indice de la campaña en el array
    var index = getIndiceDeCampania('newscontacts', campId);
    // Actualiza los datos del local storage
    _updateContacts('newscontacts', index, contactsNuevos, campId);

    // Mezcla los contactos ya guardados con los nuevos que vienen en la respuesta
    _agregarNuevosContactosaViejosContactos(contactsNuevos, campId);
}

/**
 *
 * @param local | Indice del local storage a actualizar
 * @param indice | Indice de la campaña
 * @param newscontacts | Array con nuevos contactos
 * @param campId | Id de la campaña
 * @private
 */
function _updateContacts(local, indice, newscontacts, campId) {
    var sLocalNewsContacts = localStorage.getItem(local);
    var aLocalNewsContacts = sLocalNewsContacts != null ? JSON.parse(sLocalNewsContacts) : [];

    if (indice === false) {
        // Guardamos  el array nuevo con los nuevos contactos.
        newContact = {};
        newContact.campID = campId;
        newContact.data = newscontacts;
        aLocalNewsContacts.push(newContact);
    } else {
        // si la campaña ya existe, se actualizan los contactos
        aLocalNewsContacts[indice].data = newscontacts;
    }
    localStorage.setItem(local, JSON.stringify(aLocalNewsContacts));
}

/**
 *
 * @param data
 * @param campId
 * @private
 */
function _agregarNuevosContactosaViejosContactos(data, campId) {

    // agrego los contactos guardados en localStorage
    var sLocalContacts = localStorage.getItem('contacts');
    var aLocalContacts = sLocalContacts != null ? JSON.parse(sLocalContacts) : [];
    var localContacts = [];

    // Obtenemos el indice de la campaña en el array
    var index = getIndiceDeCampania('contacts', campId);

    // Busco todos los contactos de una campaña y lo pone en la variable "localContacts"
    for (var i = 0; i < aLocalContacts.length; i++) {
        if (aLocalContacts[i] != undefined && aLocalContacts[i].campID == campId) {
            localContacts = aLocalContacts[i].data;
        }
    }

    var contactsNuevos = array_merge(data, localContacts);

    _updateContacts('contacts', index, contactsNuevos, campId);
}

/**
 *
 * @param campId
 * @param contactID
 */
function updateUltimoIdLocalStorage(campId, contactID) {
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
