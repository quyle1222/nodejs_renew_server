/** @format */

require("dotenv").config();
import db from "./app/models";
import dbConfig from "./app/config/db.config";
import { ConnectOptions } from "mongoose";
import express from "express";
import cors from "cors";
import authRoutes from "./app/routers/authRoutes";
// const bodyParser = require("body-parser");
const app = express();
const corsOptions = {
  origin: "http://localhost:8888",
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
db.mongoose.set("strictQuery", false);

db.mongoose
  .connect(dbConfig.DB)
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Do an tot nghiep." });
});

const PORT = process.env.PORT || 8888;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

//routers
authRoutes(app);
// require("./app/routers/file.routes")(app);
// require("./app/routers/firebase.routes")(app);
// require("./app/routers/shipper.routes")(app);
// require("./app/routers/order.routes")(app);
