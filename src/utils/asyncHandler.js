const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).
            catch((error) => next(error));
    }
};

export { asyncHandler }






//another method to handle async errors in express routes with try-catch blocks
// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next);
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message || "Internal Server Error"
//         });
//     }
// };