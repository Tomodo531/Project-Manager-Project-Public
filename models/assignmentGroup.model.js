const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GroupSchema = new Schema(
  {
    p_id: { type: mongoose.Schema.Types.ObjectId, ref: "projekts" },
    name: { type: String, required: true },
    assignments: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "usertemps" },
        priority: { type: Number, required: true },
        status: { type: Number, required: true },
        deadline: { type: Date, required: true }
      }
    ]
  },
  {
    timestamps: true
  }
);

const Group = mongoose.model("AssignmentGroup", GroupSchema);

module.exports = Group;
