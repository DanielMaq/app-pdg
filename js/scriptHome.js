//var pushNotification = window.plugins.pushNotification;
var badgeCount = 0;
$('#homePage').live( 'pageinit',function(event){

    setHeights();

    if(is_logged()){
        getCampaigns();
    }

    loadData();

});

/* registrar push notifitions */
document.addEventListener('deviceready', registerDevice, true);

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
        alert(err.message)
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
        window.plugins.pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, e.badge);
    }
}

// handle GCM notifications for Android
function onNotification(e) {
    switch( e.event )
    {
        case 'registered':
            if ( e.regid.length > 0 )
            //save phone ID in localstorage
            {
                console.log("regID = " + e.regid);
                $.ajax({
                    url: webServicesUrl + 'registerDevice.php',
                    type:'POST',
                    data:{newDeviceID: e.regid, newUserId: localStorage.getItem('userID'), platform: 'gcm'},
                    success:function(result){
                        var regID = localStorage.getItem('userID') + '/'+e.regid+'/gcm;'
                        localStorage.setItem('phoneID',regID)
                    },
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
        success:function(result){
            var regID = localStorage.getItem('userID') + '/'+result+'/apns;'
            localStorage.setItem('phoneID',regID);
        },
        error:function(error){
            console.log(JSON.stringify(error));
        }
    });
}

function successHandler (result) {
    badgeCount++;
    window.plugins.pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, badgeCount);
}

function errorHandler (error) {
    alert('Error del sistema: ' + error);
}

function onConfirm(buttonIndex) {
    if(buttonIndex == 1){
        window.location.href="contacts.html";
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
