const productService = require("../services/productService");
const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");
const { success } = require("../utils/response");

// ======================================
// GET ALL PRODUCTS
// ======================================

exports.getProducts = asyncHandler(async (req, res) => {

    const products = await productService.getProducts(req.query);

    return success(
        res,
        products,
        "Products retrieved successfully"
    );

});

// ======================================
// GET SINGLE PRODUCT
// ======================================

exports.getProduct = asyncHandler(async (req, res) => {

    const product = await productService.getProduct(req.params.id);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return success(
        res,
        product,
        "Product retrieved successfully"
    );

});

// ======================================
// CREATE PRODUCT
// ======================================

exports.createProduct = asyncHandler(async (req, res) => {

    const product = await productService.createProduct(req.body);

    return success(
        res,
        product,
        "Product created successfully",
        201
    );

});

// ======================================
// UPDATE PRODUCT
// ======================================

exports.updateProduct = asyncHandler(async (req, res) => {

    const product = await productService.updateProduct(
        req.params.id,
        req.body
    );

    return success(
        res,
        product,
        "Product updated successfully"
    );

});

// ======================================
// DELETE PRODUCT
// ======================================

exports.deleteProduct = asyncHandler(async (req, res) => {

    await productService.deleteProduct(req.params.id);

    return success(
        res,
        null,
        "Product deleted successfully"
    );

});