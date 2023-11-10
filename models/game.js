const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema(
  {
    x_user_id: {
      type: String,
    },
    o_user_id: {
      type: String,
    },
    x_score: {
      type: Number,
      default: 0,
    },
    o_score: {
      type: Number,
      default: 0,
    },
    current_game: {
      type: [String],
      default: ["", "", "", "", "", "", "", "", ""],
    },
    current_player: {
      type: String,
    },
    room_no: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("game", GameSchema);
