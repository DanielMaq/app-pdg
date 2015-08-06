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
                    $('.innerContainer').append('<p class="loading" style="margin-top:20px">Ingresando...</p>')
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
                        

                        // Redireccionamos a la home
                        window.location.href = "home.html";
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



function registerDevice() {
    try
    {
        //pushNotification = window.plugins.pushNotification;
        if (device.platform == 'android' || device.platform == 'Android' ) {
            /* Registro si es android */
            window.plugins.pushNotification.register(successHandler, errorHandler, {"senderID":"888853500656","ecb":"onNotification"});
        } else {
            /* Registro si es ios */
            window.plugins.pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});
        }

        window.plugins.pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, badgeCount);
        var onDelay = function(){
            window.plugins.pushNotification.setApplicationIconBadgeNumber(0, function(){});
        };
        window.setTimeout(onDelay, 1000);
    }
    catch(err)
    {
        _alert(err.message)
    }
}

function successHandler (result) {
    badgeCount++;
    window.plugins.pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, badgeCount);
}

function errorHandler (error) {
    showMessage('Error del sistema: ' + error);
}

function tokenHandler (result) {
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
    $.ajax({
        url: webServicesUrl + 'registerDevice.php',
        type:'POST',
        data:{newDeviceID: result, newUserId: localStorage.getItem('userID'), platform: 'apns'},
        success:function(result){
            var regID = result;
            localStorage.setItem('phoneID',regID);
        },
        error:function(error){
            _alert(JSON.stringify(error));
        }
    });
}
function unRegisterDevice(){

    $.ajax({
        url: webServicesUrl + 'unRegisterDevice.php',
        type:'POST',
        data:{phoneID: localStorage.getItem('phoneID'), newUserId: localStorage.getItem('lastUserID')},
        //data:{phoneID: '5e277502eef681cbade0e51c85c0d018f72eab7ed4eea7b8d70b7f0173ddc7ba', newUserId: '7219'},
        success:function(result){
            //do something
            //console.log(result);
            //localStorage.removeItem('phoneID');
        },
        error:function(error){
            //showMessage("unRegisterDivace error: " + JSON.stringify(error));
        },
        complete: function(){
            localStorage.removeItem('phoneID');
        }
    });
}



