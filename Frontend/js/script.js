document.getElementById('start_button').onclick = function() {
    const url = document.getElementById('yt_link').value;
    if (!url) {
        return false; 
    }
    window.location.href = "home.html";
}
