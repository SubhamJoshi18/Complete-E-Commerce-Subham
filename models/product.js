import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please Enter A Product Name"],
      maxlength: [100, "Please Enter name below 100 Character"],
    },
    price: {
      type: Number,
      required: [true, "Please Enter a Price Name"],
      default: 0,
    },
    description: {
      type: String,
      required: [true, "Please Enter a Description"],
      default: "",
      maxlength: [1000, "Description can not be more than 1000 characters"],
    },
    image: {
      type: String,
      default: "/upload/example.jpeg",
    },
    category: {
      type: String,
      required: [true, "Please Proive a Product Category"],
      enum: ["Gaming", "Business", "Utilities"],
    },
    company: {
      type: String,
      required: [true, "Please Provide Company"],
      enum: {
        values: ["Fantech", "NepalBazar", "Bajraj"],
        message: `{VALUE} is not supported`,
      },
    },
    colors: {
      type: [String],
      default: ["#ff0000"],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    NumberofReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

const productModel = mongoose.model("Product", productSchema);
export default productModel;
