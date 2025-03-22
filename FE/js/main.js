function loadPartials() {
    fetch('partials/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;

            // Gán sự kiện dropdown và sidebar sau khi header đã được load
            attachDropdownEvents();
            attachSidebarEvents();
        });

    fetch('partials/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        });
}

// Gọi khi trang đã tải xong
document.addEventListener("DOMContentLoaded", loadPartials);

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

function attachSidebarEvents() {
    const menuToggle = document.getElementById("menuToggle");
    const closeMenu = document.getElementById("closeMenu");
    const sideMenu = document.getElementById("sideMenu");
    const menuOverlay = document.getElementById("menuOverlay");

    if (!menuToggle || !closeMenu || !sideMenu || !menuOverlay) {
        console.error("Không tìm thấy các phần tử sidebar cần thiết!");
        return;
    }

    // Mở menu
    menuToggle.addEventListener("click", function () {
        sideMenu.style.left = "0";
        menuOverlay.style.display = "block";
    });

    // Đóng menu khi nhấn nút X
    closeMenu.addEventListener("click", function () {
        sideMenu.style.left = "-250px";
        menuOverlay.style.display = "none";
    });

    // Đóng menu khi click ra ngoài lớp phủ
    menuOverlay.addEventListener("click", function () {
        sideMenu.style.left = "-250px";
        menuOverlay.style.display = "none";
    });
}