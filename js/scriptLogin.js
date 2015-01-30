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
            return;
        }else{
            sendOk = 1;
        }

        if($.trim(pass).length === 0){
            showError('La contraseña no puede ser vacía.');
            return;
        }else{
            sendOk = 1;
        }

        if(sendOk){

            //TODO: borrar datos fijos

            /*
                username = 'gpetti@aterrizar.com.ar';
                pass = '30577262124';
            */
            $.ajax({
                url: webServicesUrl+"login.php",
                type:'POST',
                data:{email: username, password: pass},
                success:function(result){
                    var r = $.parseJSON(result);
                    if (r.data && r.data.status && r.data.status == 'success'){
                        //showError('Ingresando...', 1);
                        localStorage.setItem("userID", r.data[0].userID);
                        window.location.href="home.html";
                    }else{
                        showMessage(r.data.message);
                    }
                },
                error:function(error){
                    alert(JSON.stringify(error));
                }
            });
        }
        return;
    });
});