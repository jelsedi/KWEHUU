const express = require("express");
const router = express.Router();

const vendorController = require("../controllers/vendorController");

router.get("/", vendorController.getVendors);
router.get("/:id", vendorController.getVendor);
router.post("/", vendorController.registerVendor);
router.patch("/:id/status", vendorController.updateVendorStatus);
router.delete("/:id", vendorController.deleteVendor);

module.exports = router;