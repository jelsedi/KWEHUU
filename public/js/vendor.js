
const vendorController = require("../controllers/vendorController");

console.log(vendorController);

const express = require("express");

const router = express.Router();

const vendorController = require("../controllers/vendorController");

// GET ALL
router.get("/", vendorController.getAll);

// GET ONE
router.get("/:id", vendorController.getOne);

// CREATE
router.post("/", vendorController.create);

// APPROVE
router.patch("/:id/approve", vendorController.approve);

// DELETE
router.delete("/:id", vendorController.remove);

module.exports = router;