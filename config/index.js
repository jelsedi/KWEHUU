require("dotenv").config();

module.exports = {
    PORT: process.env.PORT || 4000,
    NODE_ENV: process.env.NODE_ENV || "development",

    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,

    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:4000"
};