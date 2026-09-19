const express = require("express");
const router = express.Router();
const {
  createPothole,
  getPotholes,
  getPotholeById,
  updatePotholeStatus,
} = require("../controllers/potholeController");

// GET  /api/potholes       — Get all potholes (with optional query filters)
// POST /api/potholes       — Create a new pothole complaint
router.route("/").get(getPotholes).post(createPothole);

// GET  /api/potholes/:id   — Get single pothole
router.route("/:id").get(getPotholeById);

// PUT  /api/potholes/:id/status — Update pothole status
router.route("/:id/status").put(updatePotholeStatus);

module.exports = router;
