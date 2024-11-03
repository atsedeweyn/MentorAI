document.getElementById('start_button').onclick = function(event) {
    event.preventDefault();
    const url = document.getElementById('yt_link').value.trim(); 
    if (url === "") {
        return false; 
    }
    window.location.href = "home.html";
}
