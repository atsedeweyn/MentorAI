document.getElementById('start_button').addEventListener('click', (event) => {
    event.preventDefault(); 
    const url = document.getElementById('yt_link').value.trim(); 
    if (url === "") {
        return false; 
    }
    window.location.href = "home.html"; 
});

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('yt_link'); 
    const button = document.getElementById('start_button');
    input.addEventListener('input', () => {
        if (input.value.trim() !== "") {
            button.disabled = false; 
        }
        else {
            button.disabled = true; 
        }
    })
})
