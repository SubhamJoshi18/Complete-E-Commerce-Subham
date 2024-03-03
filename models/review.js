import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, "Please Provide A Rating"],
    },
    title: {
      type: String,
      required: [true, "Please Provide A Title"],
      maxlength: 30,
      trim: true,
    },
    comment: {
      type: String,
      required: [true, "Please Provide A comment"],
      trim: true,
      maxlength: 500,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.statics.calculateAverageRating = async function (productId) {};
const reviewModel = mongoose.model("Review", reviewSchema);
export default reviewModel;
