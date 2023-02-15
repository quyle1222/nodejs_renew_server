/** @format */

import { Request, Response } from "express";
import { CallbackError, Mongoose, Types, Document } from "mongoose";
import table from "../models/index";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authConfig from "../config/authConfig";

interface IUser {
  username: string;
  password: string;
}
const signup = (request: Request, response: Response) => {
  const { body }: { body: IUser } = request;
  if (body) {
    const { username, password } = body;
    table.user.findOne({ username }).exec((_req, res) => {
      if (!res) {
        table.user
          .create({ username, password: bcrypt.hashSync(password, 8) })
          .then((result) => {
            response.status(200).send({
              success: true,
              data: {
                username: result.username,
                userId: result._id.toJSON(),
              },
            });
          });
      }
    });
  } else {
    response.status(500).send({
      success: false,
      message: "Username and password is required",
    });
  }
};

const login = (request: Request, response: Response) => {
  const { body }: { body: IUser } = request;
  if (body) {
    const { username, password } = body;
    table.user.findOne({ username }).exec((err, user) => {
      if (err) {
        response.status(500).send({
          success: false,
          message: err,
        });
        return;
      }
      if (!user) {
        return response.status(404).send({
          success: false,
          message: "User Not found.",
        });
      } else {
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
          return response.status(401).send({
            success: false,
            accessToken: null,
            message: "Invalid Password!",
          });
        }
        const token = jwt.sign({ id: user.id }, authConfig.secret, {
          expiresIn: 86400,
        });
        response.status(200).send({
          success: true,
          data: {
            username,
            token,
          },
        });
      }
    });
  } else {
    response.status(500).send({
      success: false,
      message: "Username and password is required",
    });
  }
};

export { signup, login };
