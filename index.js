import express from 'express'
import helmet from 'helmet';
import {rateLimit} from 'express-rate-limit'
import proxy from 'express-http-proxy';
import dotenv from 'dotenv'
import cors from 'cors'
import { RedisStore } from 'rate-limit-redis'
import {Redis} from 'ioredis'
import { logger } from './utils/logger.js';
import { ErrorHandler } from './middlewares/error-handler.middlware.js';
const app= express();
const redis = new Redis();
dotenv.config()
app.use(helmet());
app.use(express.json());
const ratelimit = rateLimit({
     windowMs: 15*60*1000,
     max:100,
     standardHeaders:true,
     legacyHeaders:false,
     store: new RedisStore({
        sendCommand:(...args)=>redis.call(...args)
     })
});
app.use((req,res,next)=>{
    logger.info(`route: ${req.url} | method:${req.method} | `)
    next()
})

app.use(ratelimit);
app.use(cors())
app.use('/v1/auth', proxy(process.env.AUTH_API,{
    proxyReqPathResolver:(req)=>{
        return req.originalUrl.replace('/v1', '')
    },
    proxyErrorHandler:(err, res,next)=>{
        res.status(500).json({
            message:'Internal server error',
            error:err.message
        });
    },
    proxyReqOptDecorator:(proxyreq,srcReq)=>{
        proxyreq.headers['Content-Type'] = 'application/json'
        return proxyreq
    }
}));
app.use(ErrorHandler)
app.listen(3001,()=>{
    console.log('app running ')
})