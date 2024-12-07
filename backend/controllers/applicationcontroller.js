import {catchAsyncError} from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";
import { Application } from "../model/applicationschema.js";
import cloudinary from "cloudinary";
import { Internship } from "../model/internshipSchema.js";

export const adminGetAllApplications = catchAsyncError(async(req, res, next) => {
    const { role } = req.user;
    if (role === "Internship seeker") {
        return next(new ErrorHandler("Internship seeker is not allowed to access this", 400));
    }
    const {_id} = req.user;
    const applications = await Application.find({'adminID.user': _id});
    res.status(200).json({
        success: true,
        applications
    });
});

export const internshipseekerGetAllApplications = catchAsyncError(async(req, res, next) => {
    const { role } = req.user;
    if (role === "Admin") {
        return next(new ErrorHandler("Admin is not allowed to access this", 400));
    }
    const {_id} = req.user;
    const applications = await Application.find({'applicantID.user': _id});
    res.status(200).json({
        success: true,
        applications
    });
});

export const internshipseekerdeleteAllapplication = catchAsyncError(async(req, res, next) => {
    const { role } = req.user;
    if (role === "Admin") {
        return next(new ErrorHandler("Admin is not allowed to access this", 400));
    }
    const { id } = req.params;
    const application = await Application.findById(id);
    if(!application) {
        return next(new ErrorHandler("Application not found", 404));
    }
    await application.deleteOne();
    res.status(200).json({
        success: true,
        message: "Application deleted successfully",
    });
});

export const postApplication = catchAsyncError(async(req, res, next) => {
    const { role } = req.user;
    if (role === "Admin") {
        return next(new ErrorHandler("Admin is not allowed to access this", 400));
    }
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Resume file required"));
    }
    const { resume } = req.files;

    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if(!allowedFormats.includes(resume.mimetype)){
        return next(new ErrorHandler("Invalid file type. Please upload your resume in a PNG, JPG or WEBP format.", 400));
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(
        resume.tempFilePath
    );
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error("Cloudinary Error: ", cloudinaryResponse.error || "Unknown cloudinary error");
        return next(new ErrorHandler("Failed to upload the resume", 500));
    }
    const {name, email, coverletter, phone, internshipId} = req.body;
    const applicantID = {
        user: req.user._id,
        role: "Internship seeker",
    };
    if(!internshipId){
        return next(new ErrorHandler("internship not found", 404));
    }
    const internshipdetails = await Internship.findById(internshipId);
    if(!internshipdetails){
        return next(new ErrorHandler("internship not found", 404));
    }
    const adminID = {
        user: internshipdetails.postedBy,
        role:"Admin",
    };
    if(!name || !email || !coverletter || !phone || !applicantID || !adminID || !resume){
        return next(new ErrorHandler("Please fill all the field", 400));
    }
    const application = await Application.create({name, email, coverletter, phone, applicantID, adminID, 
        resume:{
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });
    res.status(200).json({
        success: true,
        message: "Application submitted",
        application,
    });
});