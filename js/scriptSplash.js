$('#splashPage').live( 'pageinit',function(event){

    setTimeout(function(){
        var logged = $.isEmptyObject(sessionStorage.getItem("userID"));
        if( logged ){
            window.location.href = 'login.html';
        }else{
            window.location.href = 'home.html';
        }
    }, 1500);

});