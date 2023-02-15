/** @format */

import { Application } from "express";
import { signup, login } from "../controllers/authController";
import verifySignUp from "../middlewares/verifySignUp";
export default (app: Application) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "authorization, Origin, Content-Type, Accept",
    );
    next();
  });

  app.post(
    "/api/auth/create",
    [verifySignUp.checkDuplicateUsernameOrEmail],
    signup,
  );

  app.post("/api/auth/login", [], login);
};
