const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const PostModel = new mongoose.Schema(
  {
    images: [
      {
        type: String,
      },
    ],
    points: {
      type: Array,
      default: [],
    },
    postedBy: {
      type: ObjectId,
      ref: "user",
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    lat: {
      type: String,
    },
    lon: {
      type: String,
    },
    description: {
      type: String,
    },
    any_other: {
      type: String,
    },
    address: {
      type: String,
    },
    fooditems: [
      {
        item_name: String,
        availability: String,
        remained: String,
        spoil_in_hrs: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("post", PostModel);
