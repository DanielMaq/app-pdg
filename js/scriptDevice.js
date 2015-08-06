var badgeCount = 0;
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
    try
    {
        // Your iOS push server needs to know the token before it can push to this device
        // here is where you might want to send it the token for later use.
        $.ajax({
            url: webServicesUrl + 'registerDevice.php',
            type:'POST',
            data:{newDeviceID: result, newUserId: localStorage.getItem('userID'), platform: 'apns'},
            success:function(result){
                showMessage('[tokenHandler ok] ' + JSON.stringify(result));
                var regID = result;
                localStorage.setItem('phoneID',regID);

                registerDeviceOk();
            },
            error:function(error){
                showMessage('[tokenHandler error] ' + JSON.stringify(error));
            }
        });
    }
    catch(err)
    {
        showMessage('[tokenHandler error catch] ' + err.message);
        //registerDeviceOk();
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
            {
                //_alert("regID = " + e.regid);
                $.ajax({
                    url: webServicesUrl + 'registerDevice.php',
                    type:'POST',
                    data:{newDeviceID: e.regid, newUserId: localStorage.getItem('userID'), platform: 'gcm'},
                    success:function(result){
                        var regID = e.regid;
                        localStorage.setItem('phoneID',regID);
                        
                        registerDeviceOk();
                    },
                    error:function(error){
                        showMessage('[onNotification] ' + JSON.stringify(error));
                    }
                });
            }
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


function unRegisterDevice(){

    $.ajax({
        url: webServicesUrl + 'unRegisterDevice.php',
        type:'POST',
        data:{phoneID: localStorage.getItem('phoneID'), newUserId: localStorage.getItem('lastUserID')},
        //data:{phoneID: '5e277502eef681cbade0e51c85c0d018f72eab7ed4eea7b8d70b7f0173ddc7ba', newUserId: '7219'},
        success:function(result){
            //do something
            //console.log(result);
            //showMessage("[unRegisterDevice OK]: " + JSON.stringify(result));
        },
        error:function(error){
            showMessage("[unRegisterDevice error]: " + JSON.stringify(error));
        },
        complete: function(result){
            showMessage("[unRegisterDevice complete]" + JSON.stringify(result));
            localStorage.removeItem('phoneID');
        }
    });
}


function onConfirm(buttonIndex) {
    if(buttonIndex == 1){
        window.location.href="contacts.html";
    }
}


function registerDeviceOk()
{
    // Redireccionamos a la home
    window.location.href = "home.html";   
}