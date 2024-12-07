import mongoose from "mongoose";
import validator from "validator";

const applicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name"],
        minLength: [3, "Name must contain atleast 3 letters"],
        maxLength: [30, "NAme cannot exceed 30 letters"],
    },
    email: {
        type: String,
        validator: [validator.isEmail, "Please provide a valid email"],
        required: [true, "Please provide a valid email;"]
    },
    coverletter: {
        type: String,
        required: [true, "Please provide your cover letter"],
    },
    phone: {
        type: Number,
        required: [true, "Please provide your Phone number"],
    },
    resume: {
        public_id: {
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        },
    },
    applicantID: {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        role:{
            type: String,
            enum: ["Internship seeker"],
            required: true
        },
    },
    adminID: {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        role:{
            type: String,
            enum: ["Admin"],
            required: true
        },
    },
});


export const Application = mongoose.model("Application", applicationSchema);