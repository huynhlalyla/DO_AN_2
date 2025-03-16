document.getElementById("showRegister").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("formContainer").style.transform = "translateX(-100%)";
});

document.getElementById("showLogin").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("formContainer").style.transform = "translateX(0)";
});