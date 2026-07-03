let authToken = localStorage.getItem("kwehu_token");
let currentUser = JSON.parse(localStorage.getItem("kwehu_user") || "null");

// ==========================================
// OPEN / CLOSE MODAL
// ==========================================

function openAuthModal() {

    document.getElementById("auth-modal").classList.add("open");

    showLogin();

}

function closeAuthModal() {
    document.getElementById("auth-modal").classList.remove("open");

}

// ==========================================
// SHOW LOGIN
// ==========================================

function showLogin() {

    document.getElementById("login-form").style.display = "block";
    document.getElementById("register-form").style.display = "none";

    document.getElementById("auth-msg").innerHTML = "";

}

// ==========================================
// SHOW REGISTER
// ==========================================

function showRegister() {

    document.getElementById("login-form").style.display = "none";
    document.getElementById("register-form").style.display = "block";

    document.getElementById("auth-msg").innerHTML = "";

}

// ==========================================
// TOGGLE PASSWORD
// ==========================================

function togglePassword(inputId, button) {

    const input = document.getElementById(inputId);

    if (input.type === "password") {

        input.type = "text";
        button.innerHTML = "🙈";

    } else {

        input.type = "password";
        button.innerHTML = "👁";

    }

}

// ==========================================
// SWITCH FORMS
// ==========================================

function showLogin() {

    document.getElementById("login-form").style.display = "block";

    document.getElementById("register-form").style.display = "none";

    document.getElementById("auth-msg").innerHTML = "";

}

function showRegister() {

    document.getElementById("login-form").style.display = "none";

    document.getElementById("register-form").style.display = "block";

    document.getElementById("register-msg").innerHTML = "";

}

// ==========================================
// SHOW / HIDE PASSWORD
// ==========================================

function togglePassword(id, btn) {

    const input = document.getElementById(id);

    if (input.type === "password") {

        input.type = "text";

        btn.innerHTML = "🙈";

    } else {

        input.type = "password";

        btn.innerHTML = "👁";

    }

}

// ==========================================
// LOGIN
// ==========================================

async function login() {

    const email =
        document.getElementById("auth-email").value.trim();

    const password =
        document.getElementById("auth-password").value;

    const msg =
        document.getElementById("register-msg");

    if (!email || !password) {

        msg.innerHTML =
            '<div class="error-msg">Please fill in all fields.</div>';

        return;

    }

    try {

        msg.innerHTML =
            '<div class="loader">Signing in...</div>';

        const res = await api("/auth/login", {

            method: "POST",

            body: JSON.stringify({

                email,

                password

            })

        });

        authToken = res.data.token;

        currentUser = res.data.user;

        localStorage.setItem(

            "kwehu_token",

            authToken

        );

        localStorage.setItem(

            "kwehu_user",

            JSON.stringify(currentUser)

        );

        //updateNavForUser();

        closeAuthModal();

        toast("Welcome back 🎉");

        if (currentUser.role === "admin") {

          showPage("page-admin");

        }

        else if (currentUser.role === "vendor") {

            showPage("page-admin");

        }

        else if (currentUser.role === "rider") {

           showPage("page-rider");
        }

        else {

            showPage("page-app");
        }

    }

    catch (err) {

        msg.innerHTML =
            `<div class="error-msg">${err.message}</div>`;

    }

}

// ==========================================
// REGISTER
// ==========================================

async function register() {

    const name =
        document.getElementById("register-name").value.trim();

    const email =
        document.getElementById("register-email").value.trim();

    const phone =
        document.getElementById("register-phone").value.trim();

    const password =
        document.getElementById("register-password").value;

    const role =
        document.getElementById("register-role").value;

    const msg =
        document.getElementById("register-msg");

    if (!name || !email || !phone || !password) {

        msg.innerHTML =
            '<div class="error-msg">Please fill in all fields.</div>';

        return;

    }

    try {

        msg.innerHTML =
            '<div class="loader">Creating account...</div>';

        await api("/auth/register", {

            method: "POST",

            body: JSON.stringify({

                name,

                email,

                phone,

                password,

                role

            })

        });

       msg.innerHTML =
    '<div class="success-msg">Registration successful! Please login.</div>';
        setTimeout(() => {  showLogin(); }, 1500);
       
    }

    catch (err) {

        msg.innerHTML =
            `<div class="error-msg">${err.message}</div>`;

    }

}

// ==========================================
// LOGOUT
// ==========================================

function logout() {

    authToken = null;

    currentUser = null;

    localStorage.removeItem("kwehu_token");

    localStorage.removeItem("kwehu_user");

    updateNavForUser();

    showPage("page-landing");

    toast("Logged out");

}

document.addEventListener("DOMContentLoaded", () => {

    if (currentUser) {

        //updateNavForUser();

    }

});

// ======================================
// DEVELOPER LOGIN (Temporary)
// ======================================

function devLogin() {

    alert("NEW DEV LOGIN");

    authToken = "dev-token";

    currentUser = {
        id: "26674002-8106-4a49-b890-3ca89e7b83f5",
        name: "Developer",
        email: "dev@test.com",
        role: "customer"
    };

    localStorage.setItem("kwehu_token", authToken);
    localStorage.setItem("kwehu_user", JSON.stringify(currentUser));

    console.log(currentUser);
}