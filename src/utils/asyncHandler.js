// const asyncHandler =(fn) => async (req, res , next) =>{
//     try{
//         await fn(req, res, next);
//     }catch(error){
//         next(error);
//     }
// }


const asyncHandler = (fn) => async (req, res, next) => {
    (req , res , next) => {
        Promise.resolve(requestHandler(req , res , next)).catch((err) => next(err))
    }
}



export {asyncHandler};