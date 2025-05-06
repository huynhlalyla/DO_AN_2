function loadPartials() {
    fetch('partials/header.html')
        .then(response => response.text())
        .then(data => {
            
            document.getElementById('header').innerHTML = data;
            // Gán sự kiện cho các phần tử trong header sau khi đã được chèn vào DOM
            const navLinks = document.querySelectorAll("a.nav-link");
            const dropdownBtn = document.querySelector("#categoryMenu");
            // console.log(dropdownBtn);
            const currentPath = window.location.pathname.split("/").pop(); // Lấy tên file hiện tại
            console.log(currentPath);
            navLinks.forEach(link => {
                // console.log(link.getAttribute("href"));
                if (link.getAttribute("href") === currentPath) {
                    link.classList.add("active"); // Thêm lớp 'active' vào liên kết hiện tại
                }
            });
            const dropdownItems = document.querySelectorAll(".dropdown-item");
            const categoryMenu = document.getElementById("categoryMenu");

            dropdownItems.forEach(item => {
                if (item.getAttribute("href") === currentPath) {
                    item.classList.add("active"); // Tô đậm mục con
                    categoryMenu.classList.add("active"); // Tô đỏ nút "Danh mục"
                }
            });
            // Gán sự kiện dropdown và sidebar sau khi header đã được load
            attachDropdownEvents();
            // attachSidebarEvents();

            // Sau khi header được chèn, thực thi script
            const user = JSON.parse(sessionStorage.getItem("user"));
            if (user && user.name) {
                const userNameElement = document.getElementById("userName");
                userNameElement.innerText = user.name;
            } else {
                console.warn("Không tìm thấy thông tin người dùng trong sessionStorage.");
            }

            //đăng xuất
            const logoutBtn = document.getElementById("logoutBtn");
            if (logoutBtn) {
                logoutBtn.addEventListener("click", function () {
                    sessionStorage.removeItem("user");
                    window.location.href = "/FE/auth.html";
                });
            } else {
                console.warn("Không tìm thấy nút đăng xuất.");
            }

            renderNotifications();
            const notificationBtn = document.getElementById("notificationBtn");
            notificationBtn.addEventListener("click", function () {
                renderNotifications();
            });


        //load phần thông báo
        async function renderNotifications() {
            const data = await loadNotification();

            const notificationList = document.querySelector(".notification-list");
            
            notificationList.innerHTML = ""; // Xóa nội dung cũ trong danh sách thông báo
            let read_data = 0;
            for(noti of data) {
                if(noti.is_read == false) {
                    read_data++;
                }
            }
            const bell_count = document.querySelector('span.noti-count');
            if(data.length == 0 || read_data == 0) {
                bell_count.classList.add('d-none');
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                <i class="bi bi-primary"></i>
                <a href="#" class="dropdown-item">Không có thông báo nào!</a>
                `;
                notificationList.appendChild(listItem);
                return;
            }
            // render thông báo
            bell_count.innerText = read_data;
            bell_count.classList.remove('d-none');
            data.forEach((item) => {
                if(!item.is_read) {
                    const listItem = document.createElement("li");
                    listItem.onclick = () => {
                        updatenotify(item._id);
                        renderNotifications();
                    }
                    listItem.classList.add("notification-item");
                    listItem.innerHTML = `
                        <i class="bi bi-${item.type === "warning" ? "exclamation-triangle" : "info-circle"} text-${item.type === "warning" ? "danger" : "primary"}"></i>
                        <a href="#" class="dropdown-item">${item.message}</a>
                    `;
                    notificationList.appendChild(listItem);
                }
            });

            const clearNotiBtn = document.getElementById("clearNotifications");
            clearNotiBtn.addEventListener("click", async function () {
                const user = JSON.parse(sessionStorage.getItem("user")).id;
                const response = await fetch("http://localhost:3000/notify/deleteall", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_id: user,
                    }),
                });
                const data = await response.json();
                if(data.message == "success") {
                    renderNotifications();
                }
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
    console.log("đã vào checkLogin");
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
        // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
        window.location.href = "/FE/auth.html";
    } else {
    }
}

//logout when close
function logoutOnClose() {
    window.addEventListener("close", function (event) {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (user) {
            sessionStorage.removeItem("user");
        }
    });
}

async function loadNotification() {
    const response = await fetch("http://localhost:3000/notify/getall", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id: JSON.parse(sessionStorage.getItem("user")).id,
        }),
    });
    const data = await response.json();
    return data.notifies;
}

async function updatenotify(id) {
    const response = await fetch("http://localhost:3000/notify/update", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            notify_id: id,
        }),
    });
}
formatCurrency = function(input) {
    // Loại bỏ tất cả ký tự không phải số
    let value = input.value.replace(/\D/g, "");
    // Nếu giá trị rỗng thì không cần định dạng
    if (value === "") {
        input.value = "";
        return;
    }

    // Định dạng số có dấu chấm phân cách hàng nghìn
    input.value = new Intl.NumberFormat("vi-VN", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
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


// function attachSidebarEvents() {
//     const menuToggle = document.getElementById("menuToggle");
//     const closeMenu = document.getElementById("closeMenu");
//     const sideMenu = document.getElementById("sideMenu");
//     const menuOverlay = document.getElementById("menuOverlay");

//     if (!menuToggle || !closeMenu || !sideMenu || !menuOverlay) {
//         console.error("Không tìm thấy các phần tử sidebar cần thiết!");
//         return;
//     }

//     // Mở menu
//     menuToggle.addEventListener("click", function () {
//         sideMenu.style.left = "0";
//         menuOverlay.style.display = "block";
//     });

//     // Đóng menu khi nhấn nút X
//     closeMenu.addEventListener("click", function () {
//         sideMenu.style.left = "-250px";
//         menuOverlay.style.display = "none";
//     });

//     // Đóng menu khi click ra ngoài lớp phủ
//     menuOverlay.addEventListener("click", function () {
//         sideMenu.style.left = "-250px";
//         menuOverlay.style.display = "none";
//     });
// }

function showLoader(enable) {
    if (enable) {
        document.getElementById('loader-container').style.display = 'flex';
    } else {
        document.getElementById('loader-container').style.display = 'none';
    }
}
