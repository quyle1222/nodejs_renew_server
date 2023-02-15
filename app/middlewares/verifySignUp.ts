/** @format */

import { Request, Response } from "express";
import table from "../models";

const checkDuplicateUsernameOrEmail = (
  req: Request,
  res: Response,
  next: Function,
) => {
  const { body } = req;
  const { username } = body;
  table.user
    .findOne({
      username,
    })
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }
      next();
    });
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
};

export default verifySignUp;
