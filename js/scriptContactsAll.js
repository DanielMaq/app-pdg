var pagenew = false;

/**
 *
 * @param campId
 */
function getAllMsgs() {
    $('.results').empty();
    showAllContacts(false);
    $('p.loader').hide();
    $('.results').show();
    $('.wrapperContent').show();
}



/**
 *
 * @param campId
 */
function getCampaingMsgs(campId) {
    $('.results').empty();
    showContacts(campId, false);
    $('p.loader').hide();
    $('.results').show();
    $('.wrapperContent').show();
}

/**
 *
 * @param campId
 * @returns {*}
 */
function getUltimoId(campId) {
    var ultimoID;
    var ultimosID = localStorage.getItem('ultimoID');
    ultimosID = ultimosID != null ? JSON.parse(ultimosID) : [];
    for (var i = 0; i < ultimosID.length; i++) {
        if (ultimosID[i].campID == campId) {
            ultimoID = ultimosID[i].ultimoID;
        }
    }

    return ultimoID;
}

/**
 *
 * @param $date
 * @returns {string}
 */
function parseDate($date) {
    var date = new Date($date.replace(' ', 'T'));
    var months = {0: 'Ene', 1: 'Feb', 2: 'Mar', 3: 'Abr', 4: 'May', 5: 'Jun', 6: 'Jul', 7: 'Ago', 8: 'Sep', 9: 'Oct', 10: 'Nov', 11: 'Dic'};
    var pieces = $date.split(' ');
    var time = pieces[1];

    return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear() + ' - ' + time;
}

/**
 *
 */
function createSwipes(){
    // Create swippper
    var listadiv = $('.swiper-container');
    $.each(listadiv, function (){
        var mySwiper = new Swiper(this,{
            direction: 'horizontal',
            slidesPerView: 'auto',
            calculateHeight: true,
            width: '100%'
        });
    });
}

/**
 *
 * @param date
 * @returns {Array}
 */
function generateDate(date){
    var newDate = date.split(' ');
    newDate = newDate[0].split('-');
    newDate = newDate[2] + '/' + newDate[1] + '/' + newDate[0];
    return newDate;
}