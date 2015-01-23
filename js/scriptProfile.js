$('#profilePage').live( 'pageinit',function(event){

    setHeights(1);

    menuCreator();

    loadData();

    $('#profilePage #theForm').on('submit', function(e){
        $('#profilePage .blueBtn').trigger('click');
        e.preventDefault();
        return false;
    });


    $('#profilePage .blueBtn').on('click', function(e){ //LOGIN

        e.preventDefault();
        showError('vaciar');

        var idEmpresa = $('.campo.idEmpresa').val();
        var razonSocial = $('.campo.razonSocial').val();
        var telefono = $('.campo.telefono').val();
        var nombre = $('.campo.name').val();
        var email = $('.campo.email').val();

        var sendOk = 0;

        if($.trim(razonSocial).length === 0 ){
            showError('La razón social es requerido.');
            return;
        }else{
            sendOk = 1;
        }

        if($.trim(nombre).length === 0){
            showError('El nombre es requerido.');
            return;
        }else{
            sendOk = 1;
        }

        if($.trim(email).length === 0){
            showError('El Email es requerido.');
            return;
        }else{
            sendOk = 1;
        }

        if($.trim(telefono).length === 0){
            showError('El telefono es requerido.');
            return;
        }else{
            sendOk = 1;
        }

        if(sendOk){

            //TODO: completar

            showError('Guardando...', 1);

        }
        return;
    });

});

function loadData(){

    var uID = sessionStorage.getItem('userID');

    $.ajax({
        url: webServicesUrl+"profile.php",
        type:'POST',
        data:{uID : uID},
        success:function(result){
            var r = $.parseJSON(result);
            if (r.data && r.data.status && r.data.status == 'success'){
                var datos = r.data[0];
                
                $('.idEmpresa').val(datos.cuit);
                $('.razonSocial').val(datos.razon_social);
                $('.telefonoEmp').val(datos.telefono);
                $('.name').val(datos.nombre_apellido);
                $('.email').val(datos.email);
                //$('.emailAlt').val(datos.razon_social);
                $('.telefono').val(datos.telefono);
                $('.celular').val(datos.telefono_celular);
                $('.telefono2').val(datos.telefono_alternativo);
                
            }else{
                $('.loader, .results').hide();
                $('.noResults').show();
                //showMessage(r.data);
            }
        },
        error:function(error){
            alert(JSON.stringify(error));
        }
    });
}