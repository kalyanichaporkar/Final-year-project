import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide the interested domain"],
        minLength: [3, "Domain must contain atleast 3 characters"],
        maxLength: [50, "Domain cannot exceed 50 characters"],
    },
    description: {
        type: String,
        required: [true, "Please provide the description"],
        minLength: [50, "Description must contain at least 50 characters"],
        maxLength: [350, "Description cant exceed 350 characters"],
    },
    category: {
        type: String,
        required: [true, "Internship category is required"],
    },
    city: {
        type: String,
        required: [true, "Internship city is required"],
    },
    fixedSalary: {
        type: Number,
        minLength: [3, "Fixed Salary must contain at least 3 digits"],
        maxLength: [9, "Fixed Salary cont exceed 9 digits"],
    },
    salaryfrom: {
        type: Number,
        minLength: [3, "salaryfrom must contain at least 3 digits"],
        maxLength: [9, "salaryfrom cant exceed 9 digits"],
    },
    salaryto: {
        type: Number,
        minLength: [3, "salaryto must contain at least 3 digits"],
        maxLength: [9, "salaryto cant exceed 9 digits"],
    },
    expired: {
        type: Boolean,
        default: false,
    },
    internshipPostedon: {
        type: Date,
        default: Date.now,
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required : true,
    },
});

export const Internship = mongoose.model("Internship", internshipSchema);