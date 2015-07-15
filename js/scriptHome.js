//var pushNotification;

$('#homePage').live( 'pageinit',function(event){

    setHeights();

    if(is_logged()){
        getCampaigns();
    }

    /* registrar push notifitions */
    document.addEventListener('deviceready', registerDevice, true);

    loadData();

});

document.addEventListener('deviceready', function () {
    cordova.plugins.notification.badge.clear();
}, false);


function registerDevice() {
    try
    {
        //pushNotification = window.plugins.pushNotification;
        if (device.platform == 'android' || device.platform == 'Android' ) {
            /* Registro si es android */
            pushNotification.register(successHandler, errorHandler, {"senderID":"888853500656","ecb":"onNotification"});
        } else {
            /* Registro si es ios */
            pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});
        }
    }
    catch(err)
    {
    }
}

// handle AjvPNS notifications for iOS
function onNotificationAPN(e) {
    if (e.alert) {
        // showing an alert also requires the org.apache.cordova.dialogs plugin
        navigator.notification.confirm(
            e.alert + '\n ¿Ver Ahora?', // message
            onConfirm, // callback to invoke with index of button pressed
            'Nuevo mensaje', // title
            ['Si','Más Tarde'] // buttonLabels
        );
    }

    if (e.sound) {
        // playing a sound also requires the org.apache.cordova.media plugin
        var snd = new Media(e.sound);
        snd.play();
    }

    if (e.badge) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, e.badge);
    }
}

// handle GCM notifications for Android
function onNotification(e) {

    switch( e.event )
    {
        case 'registered':
            if ( e.regid.length > 0 )
            {
                console.log("regID = " + e.regid);
                $.ajax({
                    url: webServicesUrl + 'registerDevice.php',
                    type:'POST',
                    data:{newDeviceID: e.regid, newUserId: localStorage.getItem('userID'), platform: 'gcm'},
                    success:function(result){},
                    error:function(error){
                        console.log(JSON.stringify(error));
                    }
                });
            }
            break;

        case 'message':
            if (e.foreground){
                var mediaUrl = "/android_asset/www/sounds/knock.mp3";
                var my_media = new Media(mediaUrl, function(){ my_media.release(); } , function(e){ console.log( JSON.stringify(e) ); });
                my_media.play();
            }

            navigator.notification.confirm(
                e.message + '\n ¿Ver Ahora?', // message
                onConfirm, // callback to invoke with index of button pressed
                'Nuevo mensaje', // title
                ['Si','Más Tarde'] // buttonLabels
            );

            break;

        case 'error':
            showMessage('Ha ocurrido un error inesperado');
            break;

        default:
            //showMessage('Unknown, an event was received and we do not know what it is');
            break;
    }
}

function tokenHandler (result) {
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
    $.ajax({
        url: webServicesUrl + 'registerDevice.php',
        type:'POST',
        data:{newDeviceID: result, newUserId: localStorage.getItem('userID'), platform: 'apns'},
        success:function(result){},
        error:function(error){
            console.log(JSON.stringify(error));
        }
    });
}

function successHandler (result) {

}

function errorHandler (error) {
}

function onConfirm(buttonIndex) {
    if(buttonIndex == 1){
        window.location.href="contacts.html";
        cordova.plugins.notification.badge.increase();
    }
}


function loadData()
{
    var uID = localStorage.getItem('userID');
    $.ajax({
        url: webServicesUrl+"profile.php",
        type:'POST',
        data: {
            uID : uID
        },
        success: function(result) {
            var r = $.parseJSON(result);
            if (r.data && r.data.status && r.data.status == 'success') {
                var datos = JSON.stringify(r.data[0]);
                localStorage.setItem('userData',datos)
            }

        },
        error: function(error) {
            console.log(JSON.stringify(error));
        }
    });
}