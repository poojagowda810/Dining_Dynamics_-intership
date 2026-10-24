const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true } // This option adds `createdAt` and `updatedAt` fields
);

module.exports = mongoose.model("Category", CategorySchema);
