const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const SubmissionsSchema = new mongoose.Schema(
  {
    submissionsId: {
      type: Number,
      unique: true,
    },
    officeNumber: {
      type: String,
      required: true,
    },
    floorNumber: {
      type: String,
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

SubmissionsSchema.plugin(AutoIncrement, { inc_field: "submissionsId" });

const Submissions = mongoose.model("Submissions", SubmissionsSchema);

module.exports = { Submissions };
