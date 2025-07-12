import {logger} from '../utils/logger.js'
export const ErrorHandler = (err,req,res,next)=>{
    logger.error(err.stack);
    res.status(err.status||500).json({
        status:false,
        message: err.message||'Internal server error'
    })
}