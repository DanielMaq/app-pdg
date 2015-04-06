$('#profilePage').live( 'pageinit',function(event){

    setHeights(1);

    menuCreator();

    loadData();

    $('#profilePage #theForm').on('submit', function(e){
        $('#profilePage .save').trigger('click');
        e.preventDefault();
        return false;
    });


    $('#profilePage .save').on('click', function(e){ //LOGIN

        e.preventDefault();
        showError('vaciar');

        var idEmpresa = $('.campo.idEmpresa').val();
        var razonSocial = $('.campo.razonSocial').val();
        var telefono = $('.campo.telefono').val();
        var nombre = $('.campo.name').val();
        var email = $('.campo.email').val();

        var sendOk = 0;

        if ($.trim(razonSocial).length === 0 ) {
            showError('La razón social es requerido.');
            return;
        } else {
            sendOk = 1;
        }

        if ($.trim(nombre).length === 0) {
            showError('El nombre es requerido.');

            return;
        } else {
            sendOk = 1;
        }

        if ($.trim(email).length === 0) {
            showError('El Email es requerido.');

            return;
        } else {
            sendOk = 1;
        }

        if ($.trim(telefono).length === 0) {
            showError('El telefono es requerido.');

            return;
        } else {
            sendOk = 1;
        }

        if (sendOk) {
            saveData();
            showError('Guardando...', 1);
        }

        return;
    });

});

function loadData()
{
    var datos = JSON.parse(localStorage.getItem('userData'));

    var uID = localStorage.getItem('userID');

    $('.idEmpresa').val(datos.cuit);
    $('.razonSocial').val(datos.razon_social);
    $('.telefonoEmp').val(datos.telefono);
    $('.name').val(datos.nombre_apellido);
    $('.email').val(datos.email);
    $('.telefono').val(datos.telefono);
    $('.celular').val(datos.telefono_celular);
    $('.telefono2').val(datos.telefono_alternativo);

    $('.loader').hide();
    $('div.profileForm').fadeIn();

    //$.ajax({
    //    url: webServicesUrl+"profile.php",
    //    type:'POST',
    //    data: {
    //        uID : uID
    //    },
    //    success: function(result) {
    //        var r = $.parseJSON(result);
    //        if (r.data && r.data.status && r.data.status == 'success') {
    //            var datos = r.data[0];
    //
    //            $('.loader').hide();
    //
    //            $('.idEmpresa').val(datos.cuit);
    //            $('.razonSocial').val(datos.razon_social);
    //            $('.telefonoEmp').val(datos.telefono);
    //            $('.name').val(datos.nombre_apellido);
    //            $('.email').val(datos.email);
    //            $('.telefono').val(datos.telefono);
    //            $('.celular').val(datos.telefono_celular);
    //            $('.telefono2').val(datos.telefono_alternativo);
    //
    //            $('div.profileForm').fadeIn();
    //        } else {
    //            $('.loader, .results').hide();
    //            $('.noResults').show();
    //        }
    //
    //    },
    //    error: function(error) {
    //        console.log(JSON.stringify(error));
    //    }
    //});
}

function saveData()
{
    $.ajax({
        url: webServicesUrl + "setprofile.php",
        type:'POST',
        data:  getProfileData(),
        success: function(result) {
            var r = $.parseJSON(result);
            var message = 'ERROR';

            if (r.data && r.data.status && r.data.status == 'success') {
                message = 'Datos guardados';
            }

            showMessage(message);
            showError('vaciar');
        },
        error: function(error) {
            console.log(JSON.stringify(error));
        }
    });
}

function getProfileData()
{
    return {
        uID: localStorage.getItem('userID'),
        email: $('.email').val(),
        nombre_apellido: $('.name').val(),
        razon_social: $('.razonSocial').val(),
        telefono: $('.telefono').val(),
        telefono_alternativo: $('.telefono2').val(),
        telefono_celular: $('.celular').val()
    };
}