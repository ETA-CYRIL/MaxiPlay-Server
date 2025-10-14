import express from "express";
import "dotenv/config";
import 'express-async-error'

import "./db";

import authRouter from "./routers/auth";
import audioRouter from "./routers/audio";
import favoriteRouter from "./routers/favorite";
import playListRouter from "./routers/playlist";
import profileRouter from "./routers/profile";
import historyRouter from "./routers/history";
import "./utils/schedules";
import { errorHandler } from "./middleware/error";
import serverless from "serverless-http";

const app = express();

// register our middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("src/public"));

app.use("/auth", authRouter);
app.use("/audio", audioRouter);
app.use("/favorite", favoriteRouter);
app.use("/playlist", playListRouter);
app.use("/profile", profileRouter);
app.use("/history", historyRouter);

app.use(errorHandler)

export default serverless(app);
