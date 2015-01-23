$('#contactAnswerPage').live( 'pageinit',function(event){

    /* Verificar si hay msj, sino volver atras */
    var contact = localStorage.getItem('contacto');

    if( $.isEmptyObject(contact) ){
        window.location.href = "contacts.html";
    }else{
        //localStorage.removeItem('msgId');
    }

    setHeights(1);

    $('#contactAnswerPage .sendContactForm #loginForm').on('submit', function(e){
        $('#contactAnswerPage .sendContactForm .blueBtn').trigger('click');
        e.preventDefault();
        return false;
    });

    data = JSON.parse(contact);
    $('.name').html(data.nombre + ' ' + data.apellido);

    $('#contactAnswerPage .sendContactForm .blueBtn').on('click', function(e){ //LOGIN

        e.preventDefault();
        showError('vaciar');

        var username = $('.campo.username').val();
        var subject = $('.campo.subject').val();
        var textMsg = $('.campo.textMsg').val();

        var sendOk = 0;

        if($.trim(username).length === 0 ){
            showError('El nombre es requerido.');
            return;
        }else{
            sendOk = 1;
        }

        if($.trim(subject).length === 0){
            showError('El asunto es requerido.');
            return;
        }else{
            sendOk = 1;
        }

        if($.trim(textMsg).length === 0){
            showError('El Mensaje es requerido.');
            return;
        }else{
            sendOk = 1;
        }

        /*
         * test@gmail.com
         * master
         *
         */
        if(sendOk){
            showError('Enviando...', 1);
            
            _sendMail(username, subject, textMsg);
        }
        return;
    });


});

function _sendMail(username, subject, textMsg){

    $.ajax({
        url: webServicesUrl+"contact.php",
        type:'POST',
        data:{username : username, subject: subject, textMsg: textMsg},
        success:function(result){
            var r = $.parseJSON(result);
            if (r.data && r.data.status && r.data.status == 'success'){

                showMessage('Mensaje enviando correctamente');

                /*
                setTimeout(function(){
                    window.location.href="contacts.html";
                },2000);
                */

            }else{
                showMessage("No se pudo enviar el formulario. Intente nuevamente.");
            }
            showError('vaciar');
        },
        error:function(error){
            showError(JSON.stringify(error));
        }
    });

    return;
}