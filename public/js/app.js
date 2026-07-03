// ======================================
// KWEHU APP
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    currentUser = {
        id: "1",
        name: "Developer",
        email: "dev@test.com",
        role: "customer"
    };

    localStorage.setItem("kwehu_user", JSON.stringify(currentUser));
    localStorage.setItem("kwehu_token", "dev-token");

    showPage("page-app");
    appSection("home");

});

// ======================================
// PAGE NAVIGATION
// ======================================

function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {

        page.style.display = "none";
        page.classList.remove("active");

    });

    const page = document.getElementById(pageId);

    if (!page) {

        console.error("Page not found:", pageId);
        return;

    }

    page.style.display = "block";
    page.classList.add("active");

    const modal = document.getElementById("auth-modal");

    if (modal) {
        modal.classList.remove("open");
    }

}