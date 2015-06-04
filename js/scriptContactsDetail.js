$('#contactDetailPage').live( 'pageinit',function(event){

    /* Verificar si hay msj, sino volver atras */
    var contact = localStorage.getItem('contacto');

    if( $.isEmptyObject(contact) ){
        window.location.href = "contacts.html";
    }
    setHeights(1);
    getMsg(contact);
});

function getMsg(data){
    data = JSON.parse(data);

    // Cambiar estado a mensaje leido
    changeMsgReadStatus(data.contactID);

    $('.name').html(data.nombre + ' ' + data.apellido);
    $('.mail').html(data.email);
    $('.phone').html(data.telefono);
    $('.date').html(parseDate(data.date));
    $('.msgContent p').html(data.comentario);
}