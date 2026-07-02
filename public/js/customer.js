// ======================================
// CUSTOMER MODULE
// ======================================

let cart = [];
let vendors = [];
let products = [];
let selectedVendor = null;

// ======================================
// CUSTOMER PAGE NAVIGATION
// ======================================

function appSection(section, element = null) {

    // Highlight active menu
    document.querySelectorAll(".sidebar-menu .menu-item").forEach(item => {
        item.classList.remove("active");
    });

    if (element) {
        element.classList.add("active");
    }

    switch (section) {

        case "home":
            renderHome();
            break;

        case "cart":
            renderCart();
            break;

        case "orders":
            renderOrders();
            break;

        case "profile":
            renderProfile();
            break;

        default:
            renderHome();

    }

}
// ======================================
// HOME
// ======================================

function renderHome() {

    document.getElementById("app-main-content").innerHTML = `

        <h2>🍽 Browse Vendors</h2>

        <div id="vendor-list">
            Loading vendors...
        </div>

    `;

    loadVendors();

}

// ======================================
// LOAD VENDORS
// ======================================

async function loadVendors() {

    const container = document.getElementById("vendor-list");

    try {

        const res = await api("/vendors");

        vendors = res.data || [];

        if (vendors.length === 0) {

            container.innerHTML = `
                <div class="empty-state">
                    <h3>No vendors available</h3>
                </div>
            `;

            return;
        }

        container.innerHTML = vendors.map(vendor => `
            <div class="vendor-card" onclick="selectVendor('${vendor.id}')">

                <h3>${vendor.name}</h3>

                <p>${vendor.description || ""}</p>

                <small>${vendor.category || ""}</small>

            </div>
        `).join("");

    } catch (err) {

        console.error(err);

        container.innerHTML = `
            <div class="error-msg">
                Failed to load vendors.
            </div>
        `;

    }

}

// ======================================
// SELECT VENDOR
// ======================================

function selectVendor(id) {

    selectedVendor = id;

    alert("Selected vendor: " + id);

}

// ======================================
// CART
// ======================================

function renderCart() {

    document.getElementById("app-main-content").innerHTML = `

        <h2>🛒 My Cart</h2>

        <p>Cart functionality coming next.</p>

    `;

}

// ======================================
// ORDERS
// ======================================

function renderOrders() {

    document.getElementById("app-main-content").innerHTML = `

        <h2>📦 My Orders</h2>

        <p>No orders yet.</p>

    `;

}

// ======================================
// PROFILE
// ======================================

function renderProfile() {

    document.getElementById("app-main-content").innerHTML = `

        <h2>👤 My Profile</h2>

        <p><strong>Name:</strong> ${currentUser.name}</p>

        <p><strong>Email:</strong> ${currentUser.email}</p>

        <p><strong>Role:</strong> ${currentUser.role}</p>

    `;

}

document.addEventListener("DOMContentLoaded", () => {

    if (currentUser) {

        appSection("home");

    }

});

async function loadVendors() {

    const grid = document.getElementById("vendors-grid");

    grid.innerHTML =
        `<div class="loading-card">Loading restaurants...</div>`;

    try {

        const res = await api("/vendors");

        const vendors = res.data;

        if (!vendors.length) {

            grid.innerHTML =
                "<p>No restaurants available.</p>";

            return;

        }

        grid.innerHTML = vendors.map(v => `

            <div class="vendor-card">

                <img
                    src="${v.logo_url || 'images/vendor-placeholder.png'}"
                    class="vendor-logo"
                >

                <h3>${v.name}</h3>

                <p>${v.category}</p>

                <div class="vendor-meta">

                    ⭐ ${v.rating ?? "New"}

                </div>

                <div class="vendor-meta">

                    Delivery KSh ${v.delivery_fee}

                </div>

                <button
                    class="btn-primary"
                    onclick="openVendor('${v.id}')"
                >

                    View Menu

                </button>

            </div>

        `).join("");

    }

    catch (err) {

        grid.innerHTML =
            `<p>${err.message}</p>`;

    }

}

function openVendor(id) {

    console.log("Vendor selected:", id);

}