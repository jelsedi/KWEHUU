// ======================================
// CUSTOMER MODULE
// ======================================

let cart = [];
let vendors = [];
let selectedVendor = null;

// ======================================
// CUSTOMER PAGE NAVIGATION
// ======================================

function appSection(section, element = null) {

    document.querySelectorAll(".sidebar-menu .menu-item")
        .forEach(item => item.classList.remove("active"));

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

        <div id="vendor-list" class="vendor-grid">
            <div class="loading-card">
                Loading vendors...
            </div>
        </div>

    `;

    loadVendors();

}

// ======================================
// LOAD VENDORS
// ======================================

async function loadVendors() {

    const container = document.getElementById("vendor-list");

    if (!container) return;

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

            <div class="vendor-card">

                <img
                    src="${vendor.logo_url || 'images/vendor-placeholder.png'}"
                    class="vendor-logo"
                    alt="${vendor.name}"
                >

                <h3>${vendor.name}</h3>

                <p>${vendor.description || ""}</p>

                <div class="vendor-meta">

                    ⭐ ${vendor.rating ?? "New"}

                </div>

                <div class="vendor-meta">

                    Delivery KSh ${vendor.delivery_fee ?? 0}

                </div>

                <button
                    class="btn-primary"
                    onclick="openVendor('${vendor.id}')"
                >

                    View Menu

                </button>

            </div>

        `).join("");

    }

    catch (err) {

        console.error(err);

        container.innerHTML = `

            <div class="error-msg">

                ${err.message}

            </div>

        `;

    }

}

// ======================================
// OPEN VENDOR
// ======================================

async function openVendor(id) {

    selectedVendor = vendors.find(v => v.id === id);

    if (!selectedVendor) return;

    document.getElementById("app-main-content").innerHTML = `

        <button
            class="btn-secondary"
            onclick="renderHome()"
            style="margin-bottom:20px;"
        >
            ← Back
        </button>

        <h2>${selectedVendor.name}</h2>

        <p>${selectedVendor.description || ""}</p>

        <div id="product-list" class="vendor-grid">

            <div class="loading-card">
                Loading products...
            </div>

        </div>

    `;

    loadProducts(id);

}


// ======================================
// LOAD PRODUCTS
// ======================================

async function loadProducts(vendorId) {

    const container = document.getElementById("product-list");

    try {

        const res = await api(`/products?vendor_id=${vendorId}`);

        const products = res.data || [];

        window.currentProducts = products;

        if (!products.length) {

            container.innerHTML = `

                <div class="empty-state">

                    <h3>No products available.</h3>

                </div>

            `;

            return;

        }

        container.innerHTML = products.map(product => `

            <div class="vendor-card">

                <img
                    src="${product.image_url || 'images/product-placeholder.png'}"
                    class="vendor-logo"
                >

                <h3>${product.name}</h3>

                <p>${product.description || ""}</p>

                <div class="vendor-meta">

                    KSh ${product.price}

                </div>

               <button
                        class="btn-primary"
                        data-product="${product.id}"
                        onclick="addToCart('${product.id}')"  >
                  

                        Add to Cart

                    </button>
            </div>

        `).join("");

    }

    catch (err) {

        console.error(err);

        container.innerHTML = `

            <div class="error-msg">

                ${err.message}

            </div>

        `;

    }

}

// ======================================
// ADD TO CART
// ======================================

function addToCart(productId) {

    const product = vendors.length
        ? null
        : null;

    const selected = document.querySelector(`[data-product="${productId}"]`);

    const products = window.currentProducts || [];

    const item = products.find(p => p.id === productId);

    if (!item) return;

    const existing = cart.find(c => c.id === productId);

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            ...item,
            quantity: 1
        });

    }

    alert(`${item.name} added to cart`);

}


// ======================================
// CART
// ======================================

function renderCart() {

    const total = cart.reduce((sum, item) =>
        sum + item.price * item.quantity, 0
    );

    document.getElementById("app-main-content").innerHTML = `

        <h2>🛒 My Cart</h2>

        ${
            cart.length === 0
            ? "<p>Your cart is empty.</p>"
            : cart.map(item => `

                <div class="vendor-card">

                    <h3>${item.name}</h3>

                    <p>KSh ${item.price}</p>

                    <p>Qty: ${item.quantity}</p>

                </div>

            `).join("")
        }

        <hr>

        <h3>Total: KSh ${total}</h3>

        ${
            cart.length
            ? `<button
                    class="btn-primary"
                    onclick="checkout()"
               >
                    Checkout
               </button>`
            : ""
        }

    `;

}

// ======================================
// CHECKOUT
// ======================================

async function checkout() {

    if (!cart.length) {
        alert("Your cart is empty.");
        return;
    }

    if (!currentUser) {
        alert("Please login first.");
        return;
    }

    try {

        const vendorGroups = {};

        cart.forEach(item => {

            if (!vendorGroups[item.vendor_id]) {

                vendorGroups[item.vendor_id] = {
                    vendor_id: item.vendor_id,
                    items: []
                };

            }

            vendorGroups[item.vendor_id].items.push({

                product_id: item.id,
                quantity: item.quantity

            });

        });

        const payload = {

            customer_id: currentUser.id,

            delivery_address: "Customer Address",

            payment_method: "cash",

            vendors: Object.values(vendorGroups)

        };

        console.log("CURRENT USER:", currentUser);
        console.log("ORDER PAYLOAD:", payload);

        const res = await api("/orders", {

            method: "POST",

            body: JSON.stringify(payload)

        });

        alert("Order placed successfully!");

        console.log(res);

        cart = [];

        renderOrders();

    }

    catch (err) {

        alert(err.message);

    }

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

        <p><strong>Name:</strong> ${currentUser?.name || ""}</p>

        <p><strong>Email:</strong> ${currentUser?.email || ""}</p>

        <p><strong>Role:</strong> ${currentUser?.role || ""}</p>

        <br>

        <button
            class="btn-secondary"
            onclick="logout()"
        >
            Logout
        </button>

    `;

}

// ======================================
// INITIALIZE
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    if (
        currentUser &&
        currentUser.role === "customer"
    ) {

        appSection("home");

    }

});