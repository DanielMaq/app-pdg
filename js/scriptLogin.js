$('#loginPage').live('pageinit', function (event) {

    // Si estamos en la página de login, intentamos quitar el registro de usuario.
    unRegisterDevice();

    // Colocamos los datos del último login en el formulario
    if (localStorage.getItem('lastlogin') != null) {
        var $autoLogin = $.parseJSON(localStorage.getItem('lastlogin'))
        $('input.username').val($autoLogin.user)
        $('input.password').val($autoLogin.pw)
    }

    // Verificamos que no esté logueado.
    is_logged();

    // Ajustamos pantalla
    setHeights();

    // Configuramos el envío del formulario
    $('#loginPage #loginForm').on('submit', function (e) {
        $('#loginPage .btn.ingreso').trigger('click');
        e.preventDefault();
        return false;
    });


    // Enviamos el formulario de login
    $('#loginPage .btn.ingreso').on('click', function (e) {

        e.preventDefault();
        showError('vaciar');

        var username = $('.campo.username').val();
        var pass = $('.campo.password').val();

        var sendOk = 0;

        if ($.trim(username).length === 0) {
            showError('El email es requerido.');
            $('input.username').focus();
            return;
        } else {
            sendOk = sendOk + 1;
        }

        if ($.trim(pass).length === 0) {
            showError('La contraseña no puede ser vacía.');
            $('input.password').focus();
            return;
        } else {
            sendOk = sendOk + 1;
        }

        if (!validateEmail(username)) {
            showError('El Email ingresado no es válido');
            $('input.username').focus();
            return;
        } else {
            sendOk = sendOk + 1;
        }

        if (sendOk == 3) {
            //TODO: borrar datos fijos

            /*
             username = 'gpetti@aterrizar.com.ar';
             pass = '30577262124';
             */
            $.ajax({
                url: webServicesUrl + "login.php",
                type: 'POST',
                timeout: 5000,
                data: {email: username, password: pass},
                beforeSend: function () {
                    $('.innerContainer *').not('h2').hide()
                    $('.innerContainer p.loading').remove();
                    $('.innerContainer').append('<p class="loading" style="margin-top:20px">Ingresando...</p>');
                },
                success: function (result) {
                    var r = $.parseJSON(result);
                    if (r.data && r.data.status && r.data.status == 'success') {
                        var $lastlogin = '{"user": "' + $('input.username').val() + '", "pw": "' + $('input.password').val() + '"}';

                        // Guardamos los datos necesarios del usuario                        
                        localStorage.setItem('lastlogin', $lastlogin);
                        localStorage.setItem("userID", r.data[0].userID);
                        localStorage.setItem("lastUserID", r.data[0].userID);

                        // Registramos el dispositivo
                        $('.innerContainer p.loading').remove();
                        $('.innerContainer').append('<p class="loading" style="margin-top:20px">Registrando el dispositivo...</p>');
                        registerDevice();

                        // Redireccionamos a la home
                        //window.location.href = "home.html";
                    } else {
                        showError(r.data.message);
                        $('.innerContainer *').show()
                        $('.innerContainer p.loading').hide();
                        $('input.username').focus();
                    }
                },
                error: function (error) {
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


