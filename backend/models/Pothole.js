const mongoose = require("mongoose");

const potholeSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Reporter name is required"],
      trim: true,
    },
    phone: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["Pothole", "Road Damage", "Crack", "Sinkhole", "Other"],
      default: "Pothole",
    },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "New", "Verified", "Assigned", "Closed", "Awaiting Review"],
      default: "Pending",
    },
    reporter: {
      type: String,
      enum: ["Citizen Report", "Auto-Detected"],
      default: "Citizen Report",
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignedTo: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Indexes for fast queries
potholeSchema.index({ status: 1 });
potholeSchema.index({ severity: 1 });
potholeSchema.index({ createdAt: -1 });
potholeSchema.index({ status: 1, createdAt: -1 });
potholeSchema.index({ reportedBy: 1 });

// Auto-generate complaintId before saving
potholeSchema.pre("save", async function () {
  if (this.complaintId) return;

  const lastPothole = await mongoose
    .model("Pothole")
    .findOne()
    .sort({ createdAt: -1 });

  let nextNum = 1;
  if (lastPothole && lastPothole.complaintId) {
    const lastNum = parseInt(lastPothole.complaintId.replace("CMP-", ""), 10);
    if (!isNaN(lastNum)) nextNum = lastNum + 1;
  }

  this.complaintId = `CMP-${String(nextNum).padStart(3, "0")}`;
});

module.exports = mongoose.model("Pothole", potholeSchema);
