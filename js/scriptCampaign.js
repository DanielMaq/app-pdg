$('#campaignPage').live( 'pageinit',function(event){

    setHeights(1);

    menuCreator();

    loadCampaignSelector();

    var firstCamp = $('.campaignSelector select option:first-child').attr('data-campId');

    getCampaingPage(firstCamp);

    $('.campaignSelector select').on('change', function(){
        var campId = $(this).find('option:selected').attr('data-campId');

        $('.results').html('<p class="loader"> Cargando <img src="img/ajax-loader.gif"></p>');

        getCampaingPage(campId);

    });

});


function getCampaingPage(campId){

    var $resultsContainer = $('.results');

    var siteUrl = 'http://gpo.adverit.com/vista_previa.php?campaignID='+campId;

    $resultsContainer.html('<iframe src="'+siteUrl+'"></iframe>');

    /* Asignarle el alto necesario al iframe */
    var winH = $(window).height();
    var headH = $('.ui-header').height();
    var iframeH = winH - headH - 102; //fix margin(30), padding (32), selector (40)

    $('.results iframe').css('height', iframeH);

}