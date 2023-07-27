import express from "express";
import accountsRouter from "./routes/accounts.js";
import { promises as fs } from "fs";
import winston from "winston";
import cors from "cors";

const app = express();
const { readFile, writeFile } = fs;
const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

global.fileName = "accounts.json";
global.logger = winston.createLogger({
    level: "silly",
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: "my-bank-api.log" })
    ],
    format: combine(label({label: "my-bank-api"}),
    timestamp(), 
    myFormat
    )
});

app.use(express.json());
app.use("/account", accountsRouter);
app.use(express.static("public"));
// app.use(cors()); //Liberar todos os endpoints

app.listen(4000, async () => {
    try {
        await readFile(global.fileName);
        logger.info("API iniciada!");
    } catch (error) {
        const initialJson = {
            nextId: 1,
            accounts: []
        }
        
        writeFile(global.fileName, JSON.stringify(initialJson)).then(() => {
            logger.info("API iniciada e arquivo criado!");
        }).catch((error) => {
            logger.error(error);
        });
    }
})