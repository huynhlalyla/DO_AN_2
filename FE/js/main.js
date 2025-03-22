function loadPartials() {
    fetch('partials/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;

            // Gán sự kiện dropdown sau khi header đã được load
            attachDropdownEvents();
        });

    fetch('partials/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        });
}

// Gọi khi trang đã tải xong
document.addEventListener("DOMContentLoaded", loadPartials);

// Hàm gán sự kiện dropdown
function attachDropdownEvents() {
    const userMenu = document.querySelector(".user-menu");
    const userDropdown = document.getElementById("userDropdown");
    const categoryMenu = document.getElementById("categoryMenu");
    const categoryDropdown = document.querySelector(".dropdown-menu");

    function closeAllDropdowns() {
        if (userDropdown) userDropdown.classList.remove("show");
        if (categoryDropdown) categoryDropdown.classList.remove("show");
    }

    if (userMenu && userDropdown) {
        userMenu.addEventListener("click", function (event) {
            event.stopPropagation();
            const isOpen = userDropdown.classList.contains("show");
            closeAllDropdowns();
            if (!isOpen) userDropdown.classList.add("show");
        });
    }

    if (categoryMenu && categoryDropdown) {
        categoryMenu.addEventListener("click", function (event) {
            event.stopPropagation();
            const isOpen = categoryDropdown.classList.contains("show");
            closeAllDropdowns();
            if (!isOpen) categoryDropdown.classList.add("show");
        });
    }

    document.addEventListener("click", function () {
        closeAllDropdowns();
    });
}
