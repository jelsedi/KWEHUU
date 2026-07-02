const vendorService = require("../services/vendorService");
const asyncHandler = require("../middleware/asyncHandler");
const { success } = require("../utils/response");
const ApiError = require("../utils/ApiError");

// GET ALL
exports.getAll = asyncHandler(async (req, res) => {

    const approved = req.query.approved;

    const vendors = approved === "true"
        ? await vendorService.getApproved()
        : await vendorService.getAll();

    return success(
        res,
        vendors,
        "Vendors loaded"
    );

});

// GET ONE
exports.getOne = asyncHandler(async (req, res) => {

    const vendor = await vendorService.getById(req.params.id);

    if (!vendor) {
        throw new ApiError(404, "Vendor not found");
    }

    return success(
        res,
        vendor,
        "Vendor loaded"
    );

});

// CREATE
exports.create = asyncHandler(async (req, res) => {

    const vendor = await vendorService.create({

        ...req.body,

        approved: false,

        created_at: new Date().toISOString()

    });

    return success(
        res,
        vendor,
        "Vendor created",
        201
    );

});

// APPROVE
exports.approve = asyncHandler(async (req, res) => {

    const vendor = await vendorService.approve(req.params.id);

    return success(
        res,
        vendor,
        "Vendor approved"
    );

});

// DELETE
exports.remove = asyncHandler(async (req, res) => {

    await vendorService.delete(req.params.id);

    return success(
        res,
        null,
        "Vendor deleted"
    );

});
console.log(module.exports);