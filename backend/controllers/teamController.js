const Team = require("../models/Team");

// @desc    Get all maintenance teams
// @route   GET /api/teams
// @access  Public
const getTeams = async (req, res) => {
  try {
    const teams = await Team.find({}).sort({ createdAt: -1 }).lean();
    res.json({
      success: true,
      count: teams.length,
      teams,
    });
  } catch (error) {
    console.error("Get teams error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Create a new team
// @route   POST /api/teams
// @access  Public
const createTeam = async (req, res) => {
  try {
    const { name, lead, email, members, status } = req.body;

    if (!name || !lead || !email || !members) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if team exists
    const teamExists = await Team.findOne({ name });
    if (teamExists) {
      return res.status(400).json({
        success: false,
        message: "Team with this name already exists",
      });
    }

    const team = await Team.create({
      name,
      lead,
      email,
      members,
      status: status || "Available",
    });

    res.status(201).json({
      success: true,
      team,
    });
  } catch (error) {
    console.error("Create team error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getTeams,
  createTeam,
};
