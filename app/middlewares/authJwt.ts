/** @format */
import { Request, Response } from "express";
import jwt, { Jwt, VerifyErrors } from "jsonwebtoken";
import config from "../config/authConfig";

type TRequest = {
  userId: String;
} & Request;

const verifyToken = (req: TRequest, res: Response, next: Function) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
      success: false,
    });
  }

  jwt.verify(token, config.secret, (err: VerifyErrors | null, decoded: any) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
        success: false,
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const authJwt = {
  verifyToken,
};
export default authJwt;
