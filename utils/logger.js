import winston from 'winston'

export const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.json(),
        winston.format.splat(),
        winston.format.timestamp(),
        winston.format.errors({stack:true})
    ),
    transports:[
        new winston.transports.Console({
           format: winston.format.combine(
              winston.format.colorize(),
        winston.format.simple()
        ),
        }),
    new winston.transports.File({filename: 'error.log', level: 'error'}),
    new winston.transports.File({filename: 'combined.log'})
    ],
    defaultMeta: {service: 'api-gateway'},
        level: process.env.NODE_ENV==='prod' ? 'info': 'debug',

})