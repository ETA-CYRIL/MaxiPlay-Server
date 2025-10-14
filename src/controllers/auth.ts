import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { CreateUser, verifyEmailRequest } from "#/@types/user";
import { CreateUserSchema } from "#/utils/validationSchema";
import User from "#/models/user";
import {
  sendForgetPasswordLink,
  sendPassResetSeccuessEmail,
  sendVerificationMail,
} from "#/utils/mail";
import { formatProfile, generateToken } from "#/utils/helper";
import EmailVerificationToken from "#/models/emailVerificationToken";
import PasswordResetToken from "#/models/passwordResetToken";
import crypto from "crypto";
import { isValidObjectId } from "mongoose";
import { JWT_SECRET, PASSWORD_RESET_LINK } from "#/utils/variables";
import { match } from "assert";
import { RequestWithFiles } from "#/middleware/fileParser";
import cloudinary from "#/cloud";
import formidable from "formidable";
import { profile } from "console";
import { mustAuth } from "#/middleware/auth";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { email, password, name } = req.body;

  // 1️ Check if user already exists first
  const oldUser = await User.findOne({ email });
  if (oldUser) return res.status(403).json({ error: "User Already Exist" });

  // 2️ Create the new user
  const user = await User.create({ name, email, password });

  // 3️ Generate and store verification token
  const token = generateToken();
  await EmailVerificationToken.create({
    owner: user._id,
    token,
  });

  // 4️ Send verification email
  await sendVerificationMail(token, { name, email, userId: user._id.toString() });

  // 5️ Respond to client
  res.status(201).json({ user: { id: user._id, name, email } });
};

export const verifyEmail: RequestHandler = async (
  req: verifyEmailRequest,
  res
) => {
  const { token, userId } = req.body;

  const verificationToken = await EmailVerificationToken.findOne({
    owner: userId,
  });

  if (!verificationToken)
    return res.status(403).json({ error: "Invalid Token" });

  const matched = await verificationToken.compareToken(token);
  if (!matched) return res.status(403).json({ error: "Invalid Token" });

  await User.findByIdAndUpdate(userId, {
    verified: true,
  });

  await EmailVerificationToken.findByIdAndDelete(verificationToken._id);

  res.json({ message: "Emai Verified" });
};

export const sendReVerificationToken: RequestHandler = async (req, res) => {
  const { userId } = req.body;

  if (!isValidObjectId(userId))
    return res.status(403).json({ error: "Invalid  Request" });

  const user = await User.findById(userId);
  if (!user) return res.status(403).json({ error: "Invalid Request" });

  if (user.verified)
    return res.status(422).json({ error: "Account Already Verified" });

  await EmailVerificationToken.findOneAndDelete({
    owner: userId,
  });

  const token = generateToken();

  await EmailVerificationToken.create({
    owner: userId,
    token,
  });
  // console.log("hi");
  sendVerificationMail(token, {
    name: user?.name,
    email: user?.email,
    userId: user?._id.toString(),
  });

  res.json({ message: "Please check your Mails" });
};

export const generateForgetPasswordLink: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "Account not found" });

  await PasswordResetToken.findOneAndDelete({
    owner: user._id,
  });
  // generate the link

  const token = crypto.randomBytes(36).toString("hex");
  await PasswordResetToken.create({
    owner: user._id,
    token,
  });

  const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;

  sendForgetPasswordLink({ email: user.email, link: resetLink });

  res.json({ message: "Check your registered Email" });
};

export const grantValid: RequestHandler = async (req, res) => {
  // const { email } = req.body;

  res.json({ valid: true });
};

export const updatePassword: RequestHandler = async (req, res) => {
  const { password, userId } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(403).json({ error: "Unauthorized access!" });

  const matched = await user.comparePassword(password);
  if (matched)
    return res.status(422).json({ error: "New Password must be Different" });

  user.password = password;
  await user.save();

  await PasswordResetToken.findOneAndDelete({ owner: user._id });

  sendPassResetSeccuessEmail(user.name, user.email);

  res.json({ message: "Password Reset Successfully" });
};

export const signIn: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email,
  });
  if (!user)
    return res
      .status(403)
      .json({ error: "Email/Password mismatch!- user not found" });

  // compare passwprd
  const matched = await user.comparePassword(password);
  if (!matched)
    return res
      .status(403)
      .json({ error: "Email/Password mismatch!- wrong password" });

  // generate token
  const token = jwt.sign({ userId: user._id }, JWT_SECRET);
  user.tokens.push(token);

  await user.save();

  res.json({
    profile: {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      avatar: user.avatar?.url,
      followers: user.followers.length,
      followings: user.followings.length,
    },
    token,
  });
};

export const updateProfile: RequestHandler = async (
  req: RequestWithFiles,
  res
) => {
  const { name } = req.body;
  const avatar = req.files?.avatar as formidable.File;

  const user = await User.findById(req.user.id);

  if (!user) throw new Error("something went wring, user not found!");

  if (typeof name !== "string")
    return res.status(422).json({ error: "Invalid name" });

  if (name.trim().length < 3)
    return res.status(422).json({ error: "Invalid name short" });

  user.name = name;

  if (avatar) {
    // if avartat already exsit remove it,
    if (user.avatar?.publicId)
      await cloudinary.uploader.destroy(user.avatar?.publicId);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      avatar.filepath,
      {
        width: 300,
        height: 300,
        crop: "thumb",
        gravity: "face",
      }
    );

    user.avatar = { url: secure_url, publicId: public_id };
  }

  await user.save();

  res.json({ profile: formatProfile(user) });
};

export const sendProfile: RequestHandler = (req, res) => {
  res.json({
    profile: req.user,
  });
};

export const logOut: RequestHandler = async (req, res) => {
  const { fromAll } = req.query;

  const token = req.token;
  const user = await User.findById(req.user.id);
  if (!user) throw new Error("Something went wring, user not Found!");

  // logout from all

  if (fromAll === "yes") user.tokens = [];
  else user.tokens = user.tokens.filter((t) => t != token);
  await user.save();

  res.json({ success: true });
};
