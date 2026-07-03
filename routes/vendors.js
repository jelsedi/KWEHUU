const express = require("express");
const router = express.Router();

const vendorController = require("../controllers/vendorController");

router.get("/", vendorController.getAll);

router.get("/:id", vendorController.getOne);

router.post("/", vendorController.create);

router.patch("/:id/approve", vendorController.approve);

router.delete("/:id", vendorController.remove);

module.exports = router;