import express from "express";
import winston from "winston";

const app = express();
const { combine, printf, label, timestamp } = winston.format;
const myFormat = printf(({ level, message, label, timestamp}) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
})

app.use(express.json());

const logger = winston.createLogger({
    level: "silly",
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: "my-log.log"})
    ],
    format: combine(
        label({ label: "my-app"}),
        timestamp(),
        myFormat
    )
});

logger.error("Error log");
logger.warn("Warn log");
logger.info("Info log");
logger.verbose("Verbose log");
logger.debug("Debug log");
logger.silly("Silly log");
logger.log("info", "Erro com parametro");

app.listen(4000, () => {
    console.log("API iniciada!");
})