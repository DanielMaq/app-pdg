var logged = $.isEmptyObject(localStorage.getItem("userID"));
if (logged) {
    window.location.href = 'login.html';
} else {
    window.location.href = 'home.html';
}
