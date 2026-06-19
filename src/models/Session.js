const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    _id: String,
    session: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

sessionSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Session", sessionSchema);
