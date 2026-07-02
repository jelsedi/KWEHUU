const riderService = require("../services/riderService");

const asyncHandler = require("../middleware/asyncHandler");

const { success } = require("../utils/response");

const ApiError = require("../utils/ApiError");

// ======================================
// GET ALL RIDERS
// ======================================
exports.getRiders = asyncHandler(async (req, res) => {

    const riders = await riderService.getRiders();

    return success(
        res,
        riders,
        "Riders retrieved successfully"
    );

});

// ======================================
// GET RIDER
// ======================================
exports.getRider = asyncHandler(async (req, res) => {

    const rider = await riderService.getRiderById(req.params.id);

    if (!rider) {
        throw new ApiError(404, "Rider not found");
    }

    return success(
        res,
        rider,
        "Rider retrieved successfully"
    );

});

// ======================================
// UPDATE AVAILABILITY
// ======================================
exports.updateAvailability = asyncHandler(async (req, res) => {

    const rider = await riderService.updateAvailability(

        req.params.id,

        req.body.available

    );

    return success(
        res,
        rider,
        "Availability updated"
    );

});

// ======================================
// GET RIDER ORDERS
// ======================================
exports.getOrders = asyncHandler(async (req, res) => {

    const orders = await riderService.getOrders(req.params.id);

    return success(
        res,
        orders,
        "Orders retrieved"
    );

});

// ======================================
// COMPLETE DELIVERY
// ======================================
exports.completeDelivery = asyncHandler(async (req, res) => {

    const order = await riderService.completeDelivery(req.params.orderId);

    return success(
        res,
        order,
        "Delivery completed"
    );

});