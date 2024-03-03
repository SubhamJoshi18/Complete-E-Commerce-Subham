import reviewModel from "../models/review.js";

export const createReviews = async (req, res, next) => {
  const { product } = req.body;
  const { rating, title, comment } = req.body;
  if (!rating || !title || !comment) {
    return res.status(404).json({
      Success: true,
      message: "Field Are Missing ",
    });
  }

  const newReview = new reviewModel({
    product: product,
    rating: rating,
    title: title,
    comment: comment,
    user: req.user.aud,
  });

  const createdAReview = await newReview.save();
  return res.status(201).json({
    Success: true,
    message: `Review Created SuccessFully for the Product ${product}`,
    Review: {
      newReview,
    },
  });
};

export const GetAllReviews = async (req, res, next) => {
  //check documents
  const checkDoc = await reviewModel.countDocuments({});
  if (checkDoc === 0) {
    return res.status(403).json({
      Success: false,
      message: "There are no Reviews Currently",
    });
  }

  const pipeline = [
    { $match: { rating: { $gt: 0 } } },
    { $group: { _id: { rating: "$rating", TotalReview: { $sum: 1 } } } },
    { $sort: { TotalReview: 1 } },
  ];
  const arkoPipeline = [
    {
      $project: {
        _id: 1,
        rating: 1,
        title: 1,
        comment: 1,
        user: 1,
        product: 1,
      },
    },
  ];

  const TotalReviewAggre = await reviewModel.aggregate(pipeline);
  const OutputAggre = await reviewModel.aggregate(arkoPipeline);
  const populateOp = await reviewModel
    .find({})
    .populate({ path: "product", select: "category company price" })
    .populate({
      path: "user",
      select: "name",
    });
  return res.status(201).json({
    Success: true,
    TotalReview: {
      TotalReviewAggre,
    },
    Message: "Here are the Reviews",
    Comments: {
      populateOp,
    },
  });
};

export const GetSingleReview = async (req, res, next) => {
  const reviewId = req.params.id;
  const findtheId = await reviewModel.findOne({ _id: reviewId });
  if (!findtheId) {
    return res.status(404).json({
      Success: false,
      message: "Sorry, We could not find the Id you Requested",
    });
  }
  console.log(findtheId);
  //harek ko title chai comment nai huncha bhujna sajilo huncha vanera
  if (findtheId.title.startsWith("Comment")) {
    const pipeline = [
      {
        $project: {
          _id: 1,
          rating: 1,
          title: 1,
          comment: 1,
          user: 1,
          product: 1,
        },
      },
    ];
    const OutputAggregate = await reviewModel.aggregate(pipeline);
    return res.status(201).json({
      Success: true,
      message: "Here your Searched Review",
      Review: {
        OutputAggregate,
      },
    });
  }
};

export const UpdateReview = async (req, res, next) => {
  const checkDoc = await reviewModel.countDocuments({});
  if (checkDoc === 0) {
    return res.status(403).json({
      Success: false,
      message: "There are no Reviews Currently",
    });
  }
  const { title, rating, comment } = req.body;
  if (!title || !rating || !comment) {
    return res.status(403).json({
      Success: false,
      message: "Missing Field Required,",
    });
  }
  const reviewId = req.params.id;
  const findTheReview = await reviewModel.findOne({ _id: reviewId });
  if (!findTheReview) {
    return res.status(403).json({
      Success: false,
      message: "The Review you Requested does not exist",
    });
  }
  await reviewModel.updateOne(
    { _id: reviewId },
    {
      $set: {
        title: title,
        comment: comment,
        rating: rating,
      },
    }
  );

  const updated = await reviewModel.findOne({ _id: reviewId });
  return res.status(201).json({
    Success: true,
    Message: "Review Has Been Updated SuccessFully",
    UpdatedReview: {
      updated,
    },
  });
};

export const DeleteReview = async (req, res, next) => {
  const checkDoc = await reviewModel.countDocuments({});
  if (checkDoc === 0) {
    return res.status(403).json({
      Success: false,
      message: "There are no Reviews Currently",
    });
  }
  const reviewId = req.params.id;
  const findTheReview = await reviewModel.findOne({ _id: reviewId });
  if (!findTheReview) {
    return res.status(403).json({
      Success: false,
      message: "The Review you Requested does not exist",
    });
  }
  await reviewModel.deleteOne({ _id: reviewId });

  return res.status(201).json({
    Success: true,
    message: "Review is Deleted SuccessFully",
  });
};

export const getSingleProductReview = async (req, res, next) => {
  const productId = req.params.id;
  console.log(productId);

  const find = await reviewModel.findOne({ product: productId });
  if (!find) {
    return res.status(404).json({
      Success: false,
      message: "The following Product does not exist",
    });
  }

  return res.status(201).json({
    Success: true,
    message: "The Review of this Product are",
    Review: {
      find,
    },
  });
};
