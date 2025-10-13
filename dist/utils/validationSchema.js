"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateHistorySchema = exports.OldlaylistValidationSchema = exports.NewPlaylistValidationSchema = exports.AudioValidationSchema = exports.SignInValidationSchema = exports.UpdatePasswordSchema = exports.TokenAndIDValidation = exports.CreateUserSchema = void 0;
const yup = __importStar(require("yup"));
const mongoose_1 = require("mongoose");
const audio_categoty_1 = require("./audio_categoty");
exports.CreateUserSchema = yup.object().shape({
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
        .matches(/^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$/, "Password is too simple"),
});
exports.TokenAndIDValidation = yup.object().shape({
    token: yup.string().trim().required("Invalid Token"),
    userId: yup
        .string()
        .transform(function (value) {
        if (this.isType(value) && (0, mongoose_1.isValidObjectId)(value)) {
            return value;
        }
        return "";
    })
        .required("Invalid User Id!"),
});
exports.UpdatePasswordSchema = yup.object().shape({
    token: yup.string().trim().required("Invalid Token"),
    userId: yup
        .string()
        .transform(function (value) {
        if (this.isType(value) && (0, mongoose_1.isValidObjectId)(value)) {
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
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password is too simple"),
});
exports.SignInValidationSchema = yup.object().shape({
    email: yup
        .string()
        .required("Email is missing")
        .email("invalid Email ID!")
        .min(8, "Email is too short"),
    password: yup.string().trim().required("password is Required"),
});
exports.AudioValidationSchema = yup.object().shape({
    title: yup.string().required("Title is missing"),
    about: yup.string().required("About is missing"),
    category: yup
        .string()
        .oneOf(audio_categoty_1.categories, "Invalid category")
        .required("category is missing"),
});
exports.NewPlaylistValidationSchema = yup.object().shape({
    title: yup.string().required("Title is missing"),
    resId: yup.string().transform(function (value) {
        if (this.isType(value) && (0, mongoose_1.isValidObjectId)(value)) {
            return value;
        }
        else {
            return "";
        }
    }),
    visibility: yup
        .string()
        .oneOf(["public", "private"], " visibility must be public or private")
        .required("visibility is missing"),
});
exports.OldlaylistValidationSchema = yup.object().shape({
    title: yup.string().required("Title is missing"),
    item: yup.string().transform(function (value) {
        if (this.isType(value) && (0, mongoose_1.isValidObjectId)(value)) {
            return value;
        }
        else {
            return "";
        }
    }),
    id: yup.string().transform(function (value) {
        if (this.isType(value) && (0, mongoose_1.isValidObjectId)(value)) {
            return value;
        }
        else {
            return "";
        }
    }),
    visibility: yup
        .string()
        .oneOf(["public", "private"], " visibility must be public or private")
        .required("visibility is missing"),
});
exports.UpdateHistorySchema = yup.object().shape({
    audio: yup
        .string()
        .transform(function (value) {
        if (this.isType(value) && (0, mongoose_1.isValidObjectId)(value)) {
            return value;
        }
        else {
            return "";
        }
    })
        .required("Invalid audio id"),
    progress: yup.number().required("History progress is Missing"),
    date: yup
        .string()
        .transform(function (value) {
        const date = new Date(value);
        if (date instanceof Date)
            return value;
        return "";
    })
        .required("Invalid date"),
});
