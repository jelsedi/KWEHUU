const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");

// ===============================
// ORDERS
// ===============================
router.get("/", orderController.getAllOrders);

router.get("/vendor/:vendorId", orderController.getVendorOrders);

router.get("/customer/:customerId", orderController.getCustomerOrders);

router.get("/riders/list", orderController.getAvailableRiders);

router.get("/:id", orderController.getOrder);

router.post("/", orderController.createOrder);

router.put("/:id/status", orderController.updateOrderStatus);

router.put("/:id/assign-rider", orderController.assignRider);

module.exports = router;