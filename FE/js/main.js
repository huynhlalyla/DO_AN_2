function loadPartials() {
    fetch('partials/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;

            // Gán sự kiện dropdown và sidebar sau khi header đã được load
            attachDropdownEvents();
            attachSidebarEvents();

            // Sau khi header được chèn, thực thi script
            const user = JSON.parse(localStorage.getItem("user"));
            console.log(user);
            if (user && user.name) {
                const userNameElement = document.getElementById("userName");
                userNameElement.innerText = user.name;
            } else {
                console.warn("Không tìm thấy thông tin người dùng trong localStorage.");
            }

            //đăng xuất
            const logoutBtn = document.getElementById("logoutBtn");
            if (logoutBtn) {
                logoutBtn.addEventListener("click", function () {
                    localStorage.removeItem("user");
                    window.location.href = "/FE/auth.html";
                });
            } else {
                console.warn("Không tìm thấy nút đăng xuất.");
            }


            const notificationBtn = document.getElementById("notificationBtn");
        notificationBtn.addEventListener("click", function () {
            console.log("haha");
            renderNotifications();
        });

        async function renderNotifications() {
            const data = await loadNotification();
            console.log(data);

            const notificationList = document.querySelector(".notification-list");
            notificationList.innerHTML = ""; // Xóa nội dung cũ trong danh sách thông báo
            // render thông báo
            data.forEach((item) => {
                const listItem = document.createElement("li");
                listItem.classList.add("notification-item");
                listItem.innerHTML = `
                    <i class="bi bi-${item.type === "warning" ? "exclamation-triangle" : "info-circle"} text-${item.type === "warning" ? "danger" : "primary"}"></i>
                    <a href="#" class="dropdown-item">${item.message}</a>
                `;
                notificationList.appendChild(listItem);
            });
            

        }
        });

    fetch('partials/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        });
}

// Gọi khi trang đã tải xong
document.addEventListener("DOMContentLoaded", loadPartials);
document.addEventListener("DOMContentLoaded", function () {
    // loadNotification();
    // Kiểm tra xem người dùng đã đăng nhập hay chưa
    checkLogin();
    // Đăng xuất khi đóng trang
    logoutOnClose();
});

//kiểm tra đăng nhập chưa hay là tuồng
function checkLogin() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
        window.location.href = "/FE/auth.html";
    } else {
        // Nếu đã đăng nhập, có thể thực hiện các hành động khác nếu cần
        console.log("Người dùng đã đăng nhập:", user);
    }
}

//logout when close
function logoutOnClose() {
    window.addEventListener("close", function (event) {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            localStorage.removeItem("user");
            console.log("Người dùng đã đăng xuất khi đóng trang.");
        }
    });
}

async function loadNotification() {
    const user = JSON.parse(localStorage.getItem("user"));
    // console.log(user);
    const response = await fetch("http://localhost:3000/notify/getall", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id: JSON.parse(localStorage.getItem("user")).id,
        }),
    });
    const data = await response.json();
    return data.notifies;
}


function attachDropdownEvents() {
    const userMenu = document.querySelector(".user-menu");
    const userDropdown = document.getElementById("userDropdown");
    const categoryMenu = document.getElementById("categoryMenu");
    const categoryDropdown = document.querySelector(".dropdown-menu");
    const notificationBtn = document.getElementById("notificationBtn");
    const notificationDropdown = document.getElementById("notificationDropdown");

    function closeAllDropdowns() {
        if (userDropdown) userDropdown.classList.remove("show");
        if (categoryDropdown) categoryDropdown.classList.remove("show");
        if (notificationDropdown) notificationDropdown.classList.remove("show");
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

    if (notificationBtn && notificationDropdown) {
        notificationBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            const isOpen = notificationDropdown.classList.contains("show");
            closeAllDropdowns();
            if (!isOpen) notificationDropdown.classList.add("show");
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
