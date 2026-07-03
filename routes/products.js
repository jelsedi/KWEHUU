const express = require("express");
const router = express.Router();

const { requireAuth, requireRole } = require("../middleware/auth");
const productController = require("../controllers/productController");

// ======================================
// GET ALL PRODUCTS
// ======================================
router.get("/", productController.getProducts);

// ======================================
// GET SINGLE PRODUCT
// ======================================
router.get("/:id", productController.getProduct);

// ======================================
// CREATE PRODUCT
// ======================================
router.post(
    "/",
    requireAuth,
    requireRole("vendor", "admin"),
    productController.createProduct
);

// ======================================
// UPDATE PRODUCT
// ======================================
router.patch(
    "/:id",
    requireAuth,
    requireRole("vendor", "admin"),
    productController.updateProduct
);

// ======================================
// DELETE PRODUCT
// ======================================
router.delete(
    "/:id",
    requireAuth,
    requireRole("vendor", "admin"),
    productController.deleteProduct
);

module.exports = router;