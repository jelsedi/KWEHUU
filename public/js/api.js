const API_URL = `${window.location.origin}/api`;

async function api(endpoint, options = {}) {

    const token = localStorage.getItem("kwehu_token");

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(API_URL + endpoint, {
        ...options,
        headers
    });

    let data = {};

    try {
        data = await response.json();
    } catch (e) {}

    if (!response.ok) {
        throw new Error(
            data.message ||
            data.error ||
            "Something went wrong"
        );
    }

    return data;
}