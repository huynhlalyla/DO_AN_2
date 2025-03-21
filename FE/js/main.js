document.addEventListener("DOMContentLoaded", function () {
    const userMenu = document.querySelector(".user-menu");
    const userDropdown = document.getElementById("userDropdown");
    const categoryMenu = document.getElementById("categoryMenu");
    const categoryDropdown = document.querySelector(".dropdown-menu");

    // Hàm đóng tất cả dropdowns
    function closeAllDropdowns() {
        userDropdown.classList.remove("show");
        categoryDropdown.classList.remove("show");
    }

    // Toggle dropdown User
    userMenu.addEventListener("click", function (event) {
        event.stopPropagation();
        const isOpen = userDropdown.classList.contains("show");
        closeAllDropdowns();
        if (!isOpen) userDropdown.classList.add("show");
    });

    // Toggle dropdown Category
    categoryMenu.addEventListener("click", function (event) {
        event.stopPropagation();
        const isOpen = categoryDropdown.classList.contains("show");
        closeAllDropdowns();
        if (!isOpen) categoryDropdown.classList.add("show");
    });

    // Ẩn dropdown khi click ra ngoài
    document.addEventListener("click", function () {
        closeAllDropdowns();
    });

    document.getElementById("logoutBtn").addEventListener("click", async function (event) {
        event.preventDefault(); // Ngăn chặn chuyển trang mặc định
    
        try {
            const response = await fetch("http://localhost:3000/user/logout", {
                method: "GET",
                credentials: "include" // Đảm bảo cookie session được gửi kèm
            });
    
            if (response.ok) {
                window.location.href = "auth.html"; // Chuyển hướng về trang đăng nhập
            } else {
                console.error("Đăng xuất thất bại");
            }
        } catch (error) {
            console.error("Lỗi khi đăng xuất:", error);
        }
    });
});

