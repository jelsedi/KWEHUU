const orderService = require("../services/orderService");
const asyncHandler = require("../middleware/asyncHandler");
const { success } = require("../utils/response");
const ApiError = require("../utils/ApiError");


// =====================================
// GET ALL ORDERS
// =====================================
exports.getAllOrders = asyncHandler(async (req, res) => {

    const orders = await orderService.getAllOrders();

    return success(
        res,
        orders,
        "Orders retrieved successfully"
    );

});

// =====================================
// GET SINGLE ORDER
// =====================================
exports.getOrder = asyncHandler(async (req, res) => {

    const order = await orderService.getOrderById(req.params.id);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    return success(
        res,
        order,
        "Order retrieved successfully"
    );

});

// =====================================
// GET VENDOR ORDERS
// =====================================
exports.getVendorOrders = asyncHandler(async (req, res) => {

    const orders = await orderService.getVendorOrders(
        req.params.vendorId
    );

    return success(
        res,
        orders,
        "Vendor orders retrieved successfully"
    );

});

// =====================================
// GET CUSTOMER ORDERS
// =====================================
exports.getCustomerOrders = asyncHandler(async (req, res) => {

    const orders = await orderService.getCustomerOrders(
        req.params.customerId
    );

    return success(
        res,
        orders,
        "Customer orders retrieved successfully"
    );

});

// =====================================
// CREATE ORDER
// =====================================
exports.createOrder = asyncHandler(async (req, res) => {

    const order = await orderService.createOrder(req.body);

    return success(
        res,
        order,
        "Order created successfully",
        201
    );

});

// =====================================
// ASSIGN RIDER
// =====================================
exports.assignRider = asyncHandler(async (req, res) => {

    const order = await orderService.assignRider(
        req.params.id,
        req.body.rider_id
    );

    return success(
        res,
        order,
        "Rider assigned successfully"
    );

});

// =====================================
// UPDATE ORDER STATUS
// =====================================
exports.updateOrderStatus = asyncHandler(async (req, res) => {

    const order = await orderService.updateOrderStatus(
        req.params.id,
        req.body.status
    );

    return success(
        res,
        order,
        "Order status updated successfully"
    );

});

// =====================================
// GET AVAILABLE RIDERS
// =====================================
exports.getAvailableRiders = asyncHandler(async (req, res) => {

    const riders = await orderService.getAvailableRiders();

    return success(
        res,
        riders,
        "Available riders retrieved"
    );

});