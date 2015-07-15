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
