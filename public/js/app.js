// ======================================
// KWEHU APP
// ======================================

document.addEventListener("DOMContentLoaded", initApp);

function initApp() {

    // Hide every page
    document.querySelectorAll(".page").forEach(page => {
        page.style.display = "none";
    });

    // Check if user is already logged in
    const savedUser =
        JSON.parse(localStorage.getItem("kwehu_user"));

    if (savedUser) {

        currentUser = savedUser;

    switch (savedUser.role) {

    case "admin":
        showPage("page-admin");
        break;

    case "vendor":
        showPage("page-vendor");
        break;

    case "rider":
        showPage("page-rider");
        break;

    default:
        showPage("page-app");

        if (typeof loadVendors === "function") {
            loadVendors();
        }

}

    } else {

        showPage("page-landing");
    }

}

// ======================================
// PAGE NAVIGATION
// ======================================

function showPage(pageId) {

    // Hide all pages
    document.querySelectorAll(".page").forEach(page => {
        page.style.display = "none";
        page.classList.remove("active");
    });

    // Show requested page
    const page = document.getElementById(pageId);

    if (!page) {
        console.error("Page not found:", pageId);
        return;
    }

    page.style.display = "block";
    page.classList.add("active");

    // Close auth modal if open
    const modal = document.getElementById("auth-modal");

    if (modal) {
        modal.classList.remove("open");
    }
}