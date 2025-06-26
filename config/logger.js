const winston = require('winston');
const { format } = winston;
const { combine, timestamp, label, printf } = format;

// Create a custom format for our logs
const customFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

// Create the logger instance
const logger = winston.createLogger({
    level: 'info',
    format: combine(
        label({ label: 'BOSS-Backend' }),
        timestamp(),
        customFormat
    ),
    transports: [
        // Console transport for development
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                customFormat
            )
        }),
        // File transport for production
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        }),
        new winston.transports.File({
            filename: 'logs/combined.log'
        })
    ]
});

// Add error handling
logger.exceptions.handle([
    new winston.transports.File({ filename: 'logs/exceptions.log' })
]);

// Add uncaught exception handling
process.on('uncaughtException', (ex) => {
    logger.error('Uncaught Exception:', ex);
});

module.exports = logger;
