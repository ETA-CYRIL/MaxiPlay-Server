import * as yup from "yup";

import { isValidObjectId } from "mongoose";
import { title } from "process";
import { categories } from "./audio_categoty";

export const CreateUserSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Name id Mission")
    .min(3, "Name is too short")
    .max(20, "Name is too long"),

  email: yup
    .string()
    .required("Email is missing")
    .email("invalid Email ID!")
    .min(8, "Email is too short"),

  password: yup
    .string()
    .trim()
    .required("password is Required")
    .min(8, "Password is too short")
    .matches(
      /^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$/,
      "Password is too simple"
    ),
});

export const TokenAndIDValidation = yup.object().shape({
  token: yup.string().trim().required("Invalid Token"),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }
      return "";
    })
    .required("Invalid User Id!"),
});

export const UpdatePasswordSchema = yup.object().shape({
  token: yup.string().trim().required("Invalid Token"),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }
      return "";
    })
    .required("Invalid User Id!"),
  password: yup
    .string()
    .trim()
    .required("password is Required")
    .min(8, "Password is too short")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password is too simple"
    ),
});

export const SignInValidationSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is missing")
    .email("invalid Email ID!")
    .min(8, "Email is too short"),

  password: yup.string().trim().required("password is Required"),
});

export const AudioValidationSchema = yup.object().shape({
  title: yup.string().required("Title is missing"),
  about: yup.string().required("About is missing"),
  category: yup
    .string()
    .oneOf(categories, "Invalid category")
    .required("category is missing"),
});

export const NewPlaylistValidationSchema = yup.object().shape({
  title: yup.string().required("Title is missing"),
  resId: yup.string().transform(function (value) {
    if (this.isType(value) && isValidObjectId(value)) {
      return value;
    } else {
      return "";
    }
  }),
  visibility: yup
    .string()
    .oneOf(["public", "private"], " visibility must be public or private")
    .required("visibility is missing"),
});

export const OldlaylistValidationSchema = yup.object().shape({
  title: yup.string().required("Title is missing"),
  //validate audio id
  item: yup.string().transform(function (value) {
    if (this.isType(value) && isValidObjectId(value)) {
      return value;
    } else {
      return "";
    }
  }),
  //this is to validate playlist id
  id: yup.string().transform(function (value) {
    if (this.isType(value) && isValidObjectId(value)) {
      return value;
    } else {
      return "";
    }
  }),
  visibility: yup
    .string()
    .oneOf(["public", "private"], " visibility must be public or private")
    .required("visibility is missing"),
});

export const UpdateHistorySchema = yup.object().shape({
  audio: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      } else {
        return "";
      }
    })
    .required("Invalid audio id"),
  progress: yup.number().required("History progress is Missing"),
  date: yup
    .string()
    .transform(function (value) {
      const date = new Date(value);

      if (date instanceof Date) return value;
      return "";
    })
    .required("Invalid date"),
});
