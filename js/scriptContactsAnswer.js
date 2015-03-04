var contact = localStorage.getItem('contacto');
var contactID = $.parseJSON(contact).contactID;
var send = 0;
$('#contactAnswerPage').live( 'pageinit',function(event){

    /* Verificar si hay msj, sino volver atras */

    if( $.isEmptyObject(contact) ){
        window.location.href = "contacts.html";
    }

    setHeights(1);

    $('#contactAnswerPage .sendContactForm #loginForm').on('submit', function(e){
        $('#contactAnswerPage .sendContactForm .blueBtn').trigger('click');
        e.preventDefault();
        return false;
    });

    data = JSON.parse(contact);
    $('.name').html(data.nombre + ' ' + data.apellido);

    $('#contactAnswerPage .sendContactForm .blueBtn').on('click', function(e) { //LOGIN
        e.preventDefault();
        showError('vaciar');

        var username = $('.campo.username').val();
        var subject = $('.campo.subject').val();
        var textMsg = $('.campo.textMsg').val();

        var sendOk = 0;

        if ($.trim(username).length === 0 ) {
            showError('El nombre es requerido.');

            return;
        } else {
            sendOk = 1;
        }

        if ($.trim(subject).length === 0) {
            showError('El asunto es requerido.');

            return;
        } else {
            sendOk = 1;
        }

        if ($.trim(textMsg).length === 0) {
            showError('El Mensaje es requerido.');

            return;
        } else {
            sendOk = 1;
        }

        /*
         * test@gmail.com
         * master
         */
        if (sendOk) {
            showError('Enviando...', 1);

            if (send == 0){
                _sendMail(username, subject, textMsg);
            }else{
                showError('Ya has enviado este mensaje.')
            }
        }
        return;
    });
    $('.title.back').on('click',function(e) {
        e.preventDefault();
    })
    $('.title.back').on('touchstart',function(e){
        e.preventDefault();
        history.go(-1);
        navigator.app.backHistory();
    })

});

function _sendMail(username, subject, textMsg)
{
    $.ajax({
        url: webServicesUrl+"sendContact.php",
        type:'POST',
        data:{
            uID: localStorage.getItem('userID'),
            contactID: contactID,
            subject: subject,
            name : username,
            message: textMsg
        },
        success: function(result) {
            var r = $.parseJSON(result);
            var message = 'No se pudo enviar el mensaje. Intente nuevamente.';

            if (r.data && r.data.status && r.data.status == 'success') {
                message = 'Mensaje enviando correctamente';
                send = 1;
            }

            showMessage(message);
            showError('vaciar');

            $('.campo.username').val('');
            $('.campo.subject').val('');
            $('.campo.textMsg').val('');
        },
        error: function(error) {
            showError(JSON.stringify(error));
        }
    });

    return;
}