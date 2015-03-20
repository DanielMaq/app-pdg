$('#loginPage').live( 'pageinit',function(event){

    is_logged();

    setHeights();

    $('#loginPage #loginForm').on('submit', function(e){
        $('#loginPage .btn.ingreso').trigger('click');
        e.preventDefault();
        return false;
    });


    $('#loginPage .btn.ingreso').on('click', function(e){ //LOGIN

        e.preventDefault();
        showError('vaciar');

        var username = $('.campo.username').val();
        var pass = $('.campo.password').val();

        var sendOk = 0;

        if($.trim(username).length === 0 ){
            showError('El email es requerido.');
            $('input.username').focus();
            return;
        }else{
            sendOk = 1;
        }

        if($.trim(pass).length === 0){
            showError('La contraseña no puede ser vacía.');
            $('input.password').focus();
            return;
        }else{
            sendOk = 1;
        }

        if(!validateEmail(username)){
            showError('El Email ingresado no es válido');
            $('input.username').focus();
            return;
        }else{
            sendOk = 1;
        }
        sendOk = 1;
        if(sendOk){
            //TODO: borrar datos fijos

            /*
                username = 'gpetti@aterrizar.com.ar';
                pass = '30577262124';
            */
            $.ajax({
                url: webServicesUrl+"login.php",
                type:'POST',
                timeout: 5000,
                data:{email: username, password: pass},
                beforeSend: function(){
                    $('.innerContainer *').not('h2').hide()
                    $('.innerContainer p.loading').remove();
                    $('.innerContainer').append('<p class="loading" style="margin-top:20px">Ingresando...</p>')
                },
                success:function(result){
                    var r = $.parseJSON(result);
                    if (r.data && r.data.status && r.data.status == 'success'){
                        //showError('Ingresando...', 1);
                        localStorage.setItem("userID", r.data[0].userID);
                        window.location.href="home.html";
                    }else{
                        showError(r.data.message);
                        $('.innerContainer *').show()
                        $('.innerContainer p.loading').hide();
                        $('input.username').focus();
                    }
                },
                error:function(error){
                    showError('Error de conexión.');
                    $('.innerContainer *').show()
                    $('.innerContainer p.loading').hide();
                    $('input.username').focus();
                }
            });
        }
        return;
    });
});