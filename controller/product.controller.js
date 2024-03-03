import productModel from "../models/product.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const createProduct = async (req, res, next) => {
  req.body.user = req.user.aud;
  const { name, price, image, colors, company, description, category } =
    req.body;
  const newProduct = new productModel({
    name: name,
    price: price,
    image: image,
    colors: colors,
    company: company,
    description: description,
    category: category,
    user: req.user.aud,
  });

  const createdProduct = await newProduct
    .save()
    .then(() => {
      console.log("Product Saved SuccessFully in database");
    })
    .catch((err) => {
      console.log("Error saving The product", err);
    });
  return res.status(201).json({
    Success: true,
    message: "Product Created SuccessFully",
    Products: {
      createdProduct,
    },
  });
};

export const getAllProduct = async (req, res, next) => {
  const checkProduct = await productModel.countDocuments({});
  if (checkProduct === 0) {
    return res.status(403).json({
      Success: false,
      message: "We cannot Find Any Kind Of any Product. !Sorry maaf kardo",
    });
  }

  const product = await productModel.aggregate([
    {
      $project: {
        _id: 1,
        price: 1,
        image: 1,
        colors: 1,
        company: 1,
        description: 1,
        category: 1,

        // Fullname: {
        //   $concat: [
        //     { $toUpper: { $substrCP: ["$name", 0, 1] } },
        //     { $substrCP: ["$name", 1, { $substract: { $strlenCP: "$name" } }] },
        //   ],
        // },
      },
    },
  ]);
  console.log("line 63");

  const pipeline = [
    { $match: { price: { $gt: 25000 } } },
    { $group: { _id: "$price", totalProduct: { $sum: 1 } } },
    { $sort: { totalProduct: -1 } },
  ];
  console.log("70");

  const aggregateMain = await productModel.aggregate(pipeline);
  return res.status(201).json({
    Success: true,
    message: "List of the Products",
    ProductDescription: {
      aggregateMain,
    },
    Products: {
      product,
    },
  });
};

export const getSingleProduct = async (req, res, next) => {
  const productId = req.params.id;
  //check if the productId is a not boolean or null or undefined
  const checking = productId === null || undefined ? false : true;
  console.log(checking);

  const SearchProductId = await productModel
    .findOne({ _id: productId })
    .populate("reviews");

  if (!SearchProductId) {
    return res.status(403).json({
      Success: false,
      message: "Cannot find the Product",
    });
  }
  // const pipelie = [
  //   {
  //     $match: { _id: productId },
  //   },
  //   {
  //     $group: { _id: "$price", TotalProduct: { $sum: 1 } },
  //   },
  //   {
  //     $sort: { TotalProduct: 1 },
  //   },
  // ];

  // const product = await productModel.aggregate(pipelie);
  // console.log(product);

  if (SearchProductId) {
    return res.status(201).json({
      Success: true,
      message: "The Product You Requested",
      Product: {
        SearchProductId,
      },
    });
  }
};

export const updateProduct = async (req, res, next) => {
  const newId = req.params.id;
  const { name, price, image, colors, company, description, category } =
    req.body;
  const searchTheId = await productModel.findOne({ _id: newId });
  if (!searchTheId) {
    return res.status(403).json({
      Success: false,
      message: "Product Not Found",
    });
  }
  //NOW ID CHA VANE UPDATE GARNA
  const updateTheId = await productModel.updateOne(
    {
      _id: newId,
    },
    {
      $set: {
        name: name,
        price: price,
        image: image,
        colors: colors,
        company: company,
        description: description,
        category: category,
      },
    }
  );
  console.log(updateTheId);

  //aba update garesi audaia respose ma database ma chai hucha
  //testing
  const showNewUpdate = await productModel.aggregate([
    { $match: { name: "Gaming Chair Updated" } },
  ]);
  console.log(showNewUpdate);
  return res.status(201).json({
    Success: true,
    message: "The Product has Been Updated",
    UpdatedProduct: {
      showNewUpdate,
    },
  });
};

export const deleteProduct = async (req, res, next) => {
  const productId = req.params.id;
  const cheking = productId === null || undefined ? false : true;

  const searchTheId = await productModel.findOne({ _id: productId });
  if (!searchTheId) {
    return res.status(403).json({
      Success: false,
      message: "Product Not Found",
    });
  }
  const searchIdAndDelete = await productModel.deleteOne({ _id: productId });
  if (searchIdAndDelete !== false) {
    return res.status(201).json({
      Success: true,
      message: `${req.user.aud} with Id is Deleted SuccessFully`,
    });
  }
};

export const uploadProduct = async (req, res, next) => {
  console.log(req.files);
  if (!req.files) {
    return res.status(403).json({
      Success: false,
      message: "Cannot get a File",
    });
  }
  const productImage = req.files.images;
  console.log(productImage.mimetype);
  if (!productImage.mimetype.startsWith("image")) {
    return res.status(403).json({
      Success: false,
      message: "Please add an image",
    });
  }

  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    return res.status(403).json({
      Success: false,
      message: "Image is too large . PLease upload image smaller than 1Mb",
    });
  }
  const imagepath = path.join(
    __dirname,
    "../public/uploads" + `${productImage.name}`
  );

  await productImage.mv(imagepath);
  res.status(201).json({
    Success: true,
    message: "Image is Uploaded SuccessFully",
    image: `/uploads/${productImage.name}`,
  });
};
