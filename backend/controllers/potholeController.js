const Pothole = require("../models/Pothole");

// @desc    Create a new pothole complaint
// @route   POST /api/potholes
// @access  Public (or Protected)
const createPothole = async (req, res) => {
  try {
    const { name, phone, location, category, severity, description, reporter } =
      req.body;

    if (!name || !location || !description) {
      return res.status(400).json({
        success: false,
        message: "Name, location, and description are required",
      });
    }

    const pothole = await Pothole.create({
      name,
      phone,
      location,
      category,
      severity,
      description,
      reporter: reporter || "Citizen Report",
      reportedBy: req.user ? req.user._id : undefined,
    });

    res.status(201).json({
      success: true,
      pothole,
    });
  } catch (error) {
    console.error("Create pothole error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get all potholes (with optional filters and pagination)
// @route   GET /api/potholes
// @access  Public
const getPotholes = async (req, res) => {
  try {
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.severity) {
      filter.severity = req.query.severity;
    }

    if (req.query.reportedBy) {
      filter.reportedBy = req.query.reportedBy;
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const [potholes, total] = await Promise.all([
      Pothole.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("reportedBy", "name email")
        .lean(),
      Pothole.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count: potholes.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      potholes,
    });
  } catch (error) {
    console.error("Get potholes error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get single pothole by ID
// @route   GET /api/potholes/:id
// @access  Public
const getPotholeById = async (req, res) => {
  try {
    const pothole = await Pothole.findById(req.params.id)
      .populate("reportedBy", "name email")
      .lean();

    if (!pothole) {
      return res.status(404).json({
        success: false,
        message: "Pothole not found",
      });
    }

    res.json({
      success: true,
      pothole,
    });
  } catch (error) {
    console.error("Get pothole error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Update pothole status
// @route   PUT /api/potholes/:id/status
// @access  Public (should be Protected in production)
const updatePotholeStatus = async (req, res) => {
  try {
    const { status, assignedTo } = req.body;

    if (!status && assignedTo === undefined) {
      return res.status(400).json({
        success: false,
        message: "Status or assignedTo is required",
      });
    }

    const updateFields = {};
    if (status) updateFields.status = status;
    if (assignedTo !== undefined) updateFields.assignedTo = assignedTo;

    const pothole = await Pothole.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).lean();

    if (!pothole) {
      return res.status(404).json({
        success: false,
        message: "Pothole not found",
      });
    }

    res.json({
      success: true,
      pothole,
    });
  } catch (error) {
    console.error("Update pothole status error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createPothole,
  getPotholes,
  getPotholeById,
  updatePotholeStatus,
};

