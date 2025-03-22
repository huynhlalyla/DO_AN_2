function loadPartials() {
    fetch('partials/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;

            // Chờ DOM cập nhật xong rồi mới gán sự kiện
            setTimeout(attachDropdownEvents, 100);
        });

    fetch('partials/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        });
}

document.addEventListener("DOMContentLoaded", loadPartials);

function attachDropdownEvents() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const toggleButton = document.getElementById("sidebarToggle");

    if (!sidebar || !overlay || !toggleButton) {
        console.error("Không tìm thấy sidebar hoặc overlay!");
        return;
    }

    // Mở hoặc đóng sidebar khi nhấn nút
    toggleButton.addEventListener("click", function () {
        const isOpen = sidebar.classList.contains("show");
        sidebar.classList.toggle("show");
        overlay.classList.toggle("show", !isOpen);
    });

    // Đóng sidebar khi nhấn vào overlay
    overlay.addEventListener("click", function () {
        sidebar.classList.remove("show");
        overlay.classList.remove("show");
    });
}

// Gọi khi trang đã tải xong
document.addEventListener("DOMContentLoaded", loadPartials);

function attachDropdownEvents() {
    const userMenu = document.querySelector(".user-menu");
    const userDropdown = document.getElementById("userDropdown");
    const categoryMenu = document.getElementById("categoryMenu");
    const categoryDropdown = document.querySelector(".dropdown-menu");
    const sidebarToggle = document.getElementById("sidebarToggle");
    const sidebar = document.getElementById("sidebar");

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

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener("click", function () {
            sidebar.classList.toggle("show");
        });
    }

    document.addEventListener("click", function () {
        closeAllDropdowns();
    });
}