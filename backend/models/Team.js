const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
      unique: true,
    },
    lead: {
      type: String,
      required: [true, "Team lead name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    members: {
      type: Number,
      required: [true, "Number of members is required"],
      min: 1,
    },
    status: {
      type: String,
      enum: ["Available", "Busy", "Inactive"],
      default: "Available",
    },
  },
  { timestamps: true }
);

// Indexes for fast queries
teamSchema.index({ status: 1 });
teamSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Team", teamSchema);
