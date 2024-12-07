export const catchAsyncError = (functionnext)=>{
    return(req, res, next)=>{
        Promise.resolve(functionnext(req, res, next)).catch(next);
    };
};