document.getElementById('start_button').onclick = function(event) {
    event.preventDefault();
    const url = document.getElementById('yt_link').value.trim(); 
    if (url === "") {
        alert("Please enter a channel name");
        return false; 
    }
    window.location.href = "home.html";
}
