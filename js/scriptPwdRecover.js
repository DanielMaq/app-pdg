$('#pwdRecoverPage').live( 'pageinit',function(event) {

    setHeights();

    $('#pwdRecoverPage .btn.ingreso').on('click', function(e) { //LOGIN
        e.preventDefault();

        showError('vaciar');

        var username = $('.campo.username').val();
        var sendOk = 0;

        if ($.trim(username).length === 0) {
            showError('El email es requerido.');
            return;
        } else {
            if(validateEmail(username)){
                sendOk = 1;
            }else{
                showError('El email ingresado no es válido.');
                return
            }
        }

        if (sendOk) {

            $.ajax({
                url: webServicesUrl+"recoverPassword.php",
                type:'POST',
                data:{email : username},
                success:function(result){
                    var r = $.parseJSON(result);
                    if (r.data && r.data.status && r.data.status == 'success'){

                        showError('Se ha enviado la nueva contraseña al email ingresado.', 1);

                    }else{
                        $('.loader, .results').hide();
                        $('.noResults').show();
                        showError(r.data.message);
                    }
                },
                error:function(error){
                    console.log(JSON.stringify(error));
                }
            });
        }
    });

});