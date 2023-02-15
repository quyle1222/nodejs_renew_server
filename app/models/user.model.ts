/** @format */

import { Schema, model } from "mongoose";
export interface IUser {
  username: string;
  password: string;
}
const User = model(
  "User",
  new Schema<IUser>({
    username: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
  }),
);

module.exports = User;
