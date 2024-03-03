import mongoose from "mongoose";

const startDB = async () => {
  await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Database is Connected inside db Foler");
    })
    .catch((err) => {
      console.log(err);
    });

  mongoose.connection.on("error", () => {
    console.log("Error has been Occured In a Database");
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Database is Disconnected SuccessFully");
  });
};

export default startDB;
