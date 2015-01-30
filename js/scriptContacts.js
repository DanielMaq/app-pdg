$('#contactPage').live( 'pageinit',function(event){

    setHeights(1);

    menuCreator();

    /* Asignarle el alto necesario al contenedor */
    var winH = $(window).height();
    var headH = $('.ui-header').height();
    var resultH = winH - headH - 102; //fix margin(30), padding (32), selector (40)

    $('.results').css('height', resultH);

    loadCampaignSelector();

    var firstCamp = $('.campaignSelector select option:first-child').attr('data-campId');

    var cpId = localStorage.getItem('cid');
    if( !$.isEmptyObject(cpId) ){
        $('#select-3-button span').text('Campaña ' + cpId);
        $('.campaignSelector').val(cpId);
        firstCamp = cpId;
        localStorage.removeItem('cid');
    }

    getCampaingMsgs(firstCamp);

    $('.campaignSelector select').on('change', function(){
        var campId = $(this).find('option:selected').attr('data-campId');

        $('.results').html('<p class="loader"> Cargando <img src="img/ajax-loader.gif"></p>');

        getCampaingMsgs(campId);

    });

});

var contactos = null;

function getCampaingMsgs(campId){

    var $resultsContainer = $('.results');
    var uID = localStorage.getItem('userID');
    var campID = campId;
    var page = 0;

    $.ajax({
        url: webServicesUrl+"contact.php",
        type:'POST',
        data:{uID : uID, campID: campID, page: page},
        success:function(result){
            var r = $.parseJSON(result);
            if (r.data && r.data.status && r.data.status == 'success'){
                
                if(r.data[0] == undefined){
                    $resultsContainer.html('<p class="noResults">No se han encontrado resultados.</p>');
                }else{
                    var data = '<div class="scrollPane"><ul>';

                    contactos = r.data;

                    $.each(r.data, function (val){
                        var contact = r.data[val];

                        if (contact.contactID != undefined)
                        {
                            data += '<li data-msgId="'+val+'">';

                            data += '<div class="top">';
                            data += '<div class="left"><p>'+contact.nombre+' '+contact.apellido+'</p></div>';
                            data += '<div class="right"><p>Campaña '+campId+'</p><p>'+parseDate(contact.date)+'</p></div>';
                            data += '</div>';

                            data += '<div class="msg"><p>'+contact.comentario+'</p></div>';
                            data += '</li>';
                        }
                    });
                    data += '</ul></div>';

                    $resultsContainer.html(data);

                    var $msgs = $resultsContainer.find('li');
                    $msgs.on('click', function(){
                        var msgId = $(this).attr('data-msgId');
                        localStorage.setItem('cid', campID);
                        localStorage.setItem('contacto', JSON.stringify(contactos[msgId]));
                        window.location.href = "contactsDetail.html";
                    });
                }
                //TODO: completar

            }else{
                $resultsContainer.html('<p class="noResults">No se han encontrado resultados.</p>');
                showMessage(r.data);
            }
        },
        error:function(error){
            alert(JSON.stringify(error));
        }
    });

}

function parseDate($date)
{
    var date = new Date($date.replace(' ', 'T'));
    var months = {0: 'Ene', 1: 'Feb', 2: 'Mar', 3: 'Abr', 4: 'May', 5: 'Jun', 6: 'Jul', 7: 'Ago', 8: 'Sep', 9: 'Oct', 10: 'Nov', 11: 'Dic'};
    var pieces = $date.split(' ');
    var time = pieces[1];

    return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear() + ' - ' + time;
}