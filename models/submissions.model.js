const mongoose = require("mongoose");

const SubmissionsSchema = new mongoose.Schema(
  {
    submissionsId: {
      type: Number,
      unique: true,
    },
    officeNumber: {
      type: Number,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Submissions = mongoose.model("Submissions", SubmissionsSchema);

module.exports = { Submissions };
