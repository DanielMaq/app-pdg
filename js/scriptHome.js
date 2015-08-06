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
