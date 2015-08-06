//var pushNotification = window.plugins.pushNotification;
//var badgeCount = 0;
$('#homePage').live( 'pageinit',function(event){

    setHeights();

    if(is_logged()){
        getCampaigns();
    }

    loadData();

});

/* registrar push notifitions */
//document.addEventListener('deviceready', registerDevice, true);
document.addEventListener('deviceready', notificationDevice, true);

function _alert(msg){
    alert(msg);
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
            _alert(JSON.stringify(error));
        }
    });
}


var badgeCount = 0;
function notificationDevice() {
    try
    {
        //pushNotification = window.plugins.pushNotification;
        if (device.platform == 'android' || device.platform == 'Android' ) {
            /* Registro si es android */
            window.plugins.pushNotification.register(successHandler, errorHandler, {"senderID":"888853500656","ecb":"onNotification"});
        } else {
            /* Registro si es ios */
            window.plugins.pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});
            
            window.plugins.pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, badgeCount);
            var onDelay = function(){
                window.plugins.pushNotification.setApplicationIconBadgeNumber(0, function(){});
            };
            window.setTimeout(onDelay, 1000);
        }
    }
    catch(err)
    {
        showMessage('[registerDevice] ' + err.message);
        //registerDeviceOk();
    }
}

function successHandler(result) {
    if (device.platform != 'android' && device.platform != 'Android' ) {
        badgeCount++;
        window.plugins.pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, badgeCount);
    }
}

function errorHandler (error) {
    showMessage('[errorHandler] Error del sistema: ' + error);

    //registerDeviceOk();
}

function tokenHandler (result) {
    return true;
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
        window.plugins.pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, e.badge);
    }
}


// handle GCM notifications for Android
function onNotification(e) {
    switch( e.event )
    {
        case 'registered':
            break;

        case 'message':
            if (e.foreground){
                var mediaUrl = "/android_asset/www/sounds/knock.mp3";
                var my_media = new Media(mediaUrl, function(){ my_media.release(); } , function(e){ _alert( JSON.stringify(e) ); });
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

function onConfirm(buttonIndex) {
    if(buttonIndex == 1){
        window.location.href="contacts.html";
    }
}