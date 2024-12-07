import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";
import { Internship } from "../model/internshipSchema.js";

export const getAllInternships = catchAsyncError(async (req, res, next) => {
    const internships = await Internship.find({expired: false });
    res.status(200).json({
        success: true,
        internships,
    });
});


export const postInternships = catchAsyncError(async(req ,res, next) => {
    const {role} = req.user;
    if (role === "Internship seeker"){
        return next(
            new ErrorHandler(
                "Internship Seeker is not allowed to access this resources",
                400
            )
        );
    }
    const {title, description, category, city, fixedSalary, salaryfrom, salaryto} = req.body;

    if(!title || !description || !category || !city){
        return next(new ErrorHandler("Please provide full job details", 400));
    }
    if((!salaryfrom || !salaryto) && !fixedSalary){
        return next(new ErrorHandler("Please provide either fixed salary or ranged salary"));
    }
    if(salaryfrom && salaryto && fixedSalary){
        return next("Cannot enter fixed salary and ranged salary together");
    }

    const postedBy = req.user._id;
    const internship =  await Internship.create({
        title, description, category, city, fixedSalary, salaryfrom, salaryto, postedBy
    })

    res.status(200).json({
        success: true,
        message: "Intership posted successfully",
        internship,
    });
});

export const getMyInternships = catchAsyncError(async(req, res, next) => {
    const { role } = req.user;
    if (role === "Internship seeker") {
        return next(new ErrorHandler("Internship seeker is not allowed to access this", 400));
    }
    const myinternships = await Internship.find({postedBy: req.user._id});
    res.status(200).json({
        success: true,
        myinternships,
    });
});

export const updateinternship = catchAsyncError(async(req, res, next) => {
    const { role } = req.user;
    if (role === "Internship seeker") {
        return next(new ErrorHandler("Internship seeker is not allowed to access this", 400));
    }
    const {id} = req.params;
    let internship = await Internship.findById(id);
    if(!internship){
        return next(new ErrorHandler("Internship not found", 404));
    }
    internship = await Internship.findByIdAndUpdate(id, req.body,{
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
        internship,
        message: "Internship updated successfully",
    });
});


export const deleteInternship = catchAsyncError(async(req, res, next) =>{
    const { role } = req.user;
    if (role === "Internship seeker") {
        return next(new ErrorHandler("Internship seeker is not allowed to access this", 400));
    }
    const {id} = req.params;
    let internship = await Internship.findById(id);
    if(!internship){
        return next(new ErrorHandler("Internship not found", 404));
    }
    await internship.deleteOne();
    res.status(200).json({
        success: true,
        message: "Internship deleted successfully",
    });
});

export const getSingleInternship = catchAsyncError(async(req, res, next) =>{
    const { id } = req.params;
    try {
        const internship = await Internship.findById(id);
        if(!internship) {
            return next(new ErrorHandler("Internship not found", 404));
        }
        res.status(200).json({
            success: true,
            internship
        });
    } catch (error) {
        return next(new ErrorHandler("Invalid ID/ CastError", 400))
    }
});