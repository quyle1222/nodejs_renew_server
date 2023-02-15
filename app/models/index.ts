/** @format */

import mongoose, { Mongoose, Schema, Model } from "mongoose";
import { IUser } from "./user.model";

mongoose.Promise = global.Promise;

interface ITable {
  mongoose: Mongoose;
  shipper: Model<any>;
  order: Model<any>;
  user: Model<IUser>;
}
const table: ITable = {
  mongoose: mongoose,
  shipper: require("./shipper.model"),
  order: require("./order.model"),
  user: require("./user.model"),
};

export default table;
