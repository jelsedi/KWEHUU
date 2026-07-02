const authService = require("../services/authService");

const asyncHandler = require("../middleware/asyncHandler");

const { success } = require("../utils/response");

// ======================================
// REGISTER
// ======================================
exports.register = asyncHandler(async (req, res) => {

    const user = await authService.register(req.body);

    return success(

        res,

        user,

        "Registration successful",

        201

    );

});

// ======================================
// LOGIN
// ======================================
exports.login = asyncHandler(async (req, res) => {

    const session = await authService.login(

        req.body.email,

        req.body.password

    );

    return success(

        res,

        session,

        "Login successful"

    );

});

// ======================================
// PROFILE
// ======================================
exports.profile = asyncHandler(async (req, res) => {

    const profile = await authService.getProfile(

        req.user.id

    );

    return success(

        res,

        profile,

        "Profile loaded"

    );

});

// ======================================
// UPDATE PROFILE
// ======================================
exports.updateProfile = asyncHandler(async (req, res) => {

    const profile = await authService.updateProfile(

        req.user.id,

        req.body

    );

    return success(

        res,

        profile,

        "Profile updated"

    );

});

// ======================================
// LOGOUT
// ======================================
exports.logout = asyncHandler(async (req, res) => {

    await authService.logout();

    return success(

        res,

        null,

        "Logged out successfully"

    );

});