import productModel from "../models/product.js";
import orderModel from "../models/order.js";

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "SomeRandomSecret";
  return { client_secret, amount };
};
export const getallOrder = async (req, res, next) => {
  const projection = await orderModel.aggregate([
    {
      $project: {
        _id: 1,
        tax: 1,
        ShippingFee: 1,
        subtotal: 1,
        total: 1,
        cartItems: 1,
        user: 1,
        clientSecret: 1,
        status: 1,
      },
    },
  ]);
  const findall = await orderModel.find({});

  return res.status(201).json({
    Sucess: true,
    message: `${req.user.aud} OR  This is your Cart`,
    Cart: {
      projection,
    },
  });
};

export const getSingleOrder = async (req, res, next) => {
  const orderId = req.params.id;

  const searchTheOrder = await orderModel.findOne({ _id: orderId });
  if (!searchTheOrder) {
    return res.status(403).json({
      Success: true,
      message: "The Order Does not Exist",
    });
  }

  console.log("line 21");
  const populate = await orderModel.find({ _id: orderId }).populate({
    path: "user",
    select: "name, role",
  });

  const projection = [
    {
      $group: {
        _id: "$_id",
        TotalItemsInCart: { $sum: { $size: "$cartItems" } },
      },
    },
  ];
  const finalProjection = await orderModel.aggregate(projection);
  return res.status(201).json({
    Success: true,
    message: "Here it is your Product",
    CartDescription: {
      finalProjection,
    },
    Cart: {
      populate,
    },
  });
};

export const getCurrentUserOrder = async (req, res, next) => {
  const findUser = await orderModel.findOne({ user: req.user.aud });
  console.log(findUser);
  const arrayofCurrent = findUser.cartItems;
  console.log(arrayofCurrent);
  for (const item of arrayofCurrent) {
    const checkProduct = await productModel.findOne({ _id: item.product });
    if (!checkProduct) {
      return res.status(201).json({
        Success: true,
        message: "Product Does not Match",
      });
    }
  }
  if (findUser) {
    return res.status(201).json({
      Success: true,
      message: `Current User ${req.user.username} and The Product is ${arrayofCurrent[0].name}`,
      Order: {
        arrayofCurrent,
      },
    });
  }
};

export const createOrder = async (req, res, next) => {
  const { items: cartItems } = req.body;
  const { tax, ShippingFee } = req.body;
  if (!cartItems || cartItems.length < 1) {
    return res.status(403).json({
      Success: false,
      message: "No cart Item Provided",
    });
  }
  if (!tax || !ShippingFee) {
    return res.status(403).json({
      Success: false,
      message: "No Tax and Shipping Fee is Provided",
    });
  }

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await productModel.findOne({ _id: item.product });
    if (!dbProduct) {
      return res.status(403).json({
        Success: false,
        message: `No product with id: ${item.product}`,
      });
    }
    console.log(dbProduct);
    const { name, price, image, _id } = dbProduct;
    const singleOrder = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
    orderItems = [...orderItems, singleOrder];
    subtotal += item.amount * price;
  }
  console.log(orderItems);
  const total = tax + ShippingFee + subtotal;
  //clientSecret
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "Rs",
  });
  const createOrder = new orderModel({
    tax: tax,
    ShippingFee: ShippingFee,
    subtotal: subtotal,
    total: total,
    cartItems: orderItems,
    clientSecret: paymentIntent.client_secret,
    user: req.user.aud,
  });
  const savedb = await createOrder.save();
  res.status(201).json({
    Success: true,
    message: "Cart Items",
    OrderItem: {
      savedb,
    },
  });
};

export const updateOrder = async (req, res, next) => {
  const orderId = req.params.id;
  if (!orderId || typeof orderId === "boolean") {
    return res.status(403).json({
      Success: false,
      messge: "Order Id does not match",
    });
  }
  const { tax, ShippingFee, subtotal, total, status } = req.body;
  const searchTheOrder = await orderModel.findOne({ _id: orderId });
  if (!searchTheOrder) {
    return res.status(403).json({
      Success: false,
      message: "The Order Id does not exist",
    });
  }

  await orderModel.updateOne(
    { _id: orderId },
    {
      $set: {
        tax: tax,
        ShippingFee: ShippingFee,
        subtotal: subtotal,
        total: total,
        status: status,
      },
    }
  );
  const findAfterUpdate = await orderModel.aggregate([
    { $match: { _id: orderId } },
  ]);

  const findOne = await orderModel.findOne({ _id: orderId });
  return res.status(201).json({
    Success: true,
    message: "Order after Updated SuccessFully",
    UpdatedOrder: {
      findAfterUpdate,
      findOne,
    },
  });
};
