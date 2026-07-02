const vendorService = require("../services/vendorService");
const asyncHandler = require("../middleware/asyncHandler");
const { success } = require("../utils/response");
const ApiError = require("../utils/ApiError");

// GET ALL VENDORS
exports.getVendors = asyncHandler(async (req, res) => {

    const approved =
        req.query.approved === "false"
            ? false
            : true;

    const vendors = await vendorService.getVendors(approved);

    return success(res, vendors, "Vendors retrieved successfully");
});

// GET SINGLE VENDOR
exports.getVendor = asyncHandler(async (req, res) => {

    const vendor = await vendorService.getVendor(req.params.id);

    if (!vendor) {
        throw new ApiError(404, "Vendor not found");
    }

    return success(res, vendor, "Vendor retrieved successfully");
});

// REGISTER
exports.registerVendor = asyncHandler(async (req, res) => {

    const vendor = await vendorService.registerVendor(req.body);

    return success(res, vendor, "Vendor registration submitted", 201);
});

// UPDATE STATUS
exports.updateVendorStatus = asyncHandler(async (req, res) => {

    const vendor = await vendorService.updateVendorStatus(
        req.params.id,
        req.body.approved
    );

    return success(res, vendor, "Vendor updated successfully");
});

// DELETE
exports.deleteVendor = asyncHandler(async (req, res) => {

    await vendorService.deleteVendor(req.params.id);

    return success(res, null, "Vendor deleted successfully");
});