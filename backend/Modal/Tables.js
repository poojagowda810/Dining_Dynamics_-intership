const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    seats: {
      type: Number,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true } // This option adds `createdAt` and `updatedAt` fields
);

module.exports = mongoose.model("table", TableSchema);
