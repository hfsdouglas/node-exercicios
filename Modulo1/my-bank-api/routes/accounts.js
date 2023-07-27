import express from "express";
import { promises as fs } from "fs";
import cors from "cors";

const router = express.Router();
const { readFile, writeFile } = fs;

router.post("/", async (req, res, next) => {
    try {
        let account = req.body;

        if (!account.name || !account.balance == null) {
            throw new Error("Nome e Balanço são obrigatórios");
        }
        
        const data = JSON.parse(await readFile(global.fileName));

        account = { 
            id: data.nextId, 
            name: account.name,
            balance: account.balance
        };

        data.nextId++;
        data.accounts.push(account);
        await writeFile(global.fileName, JSON.stringify(data, null, 2));

        res.send(account);

        logger.info(`POST /account - ${JSON.stringify(account)}`);
    } catch(error) {
        next(error);
    }
});

// Liberação de um único endpoint para acesso de API aberta

router.get("/", cors(), async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        delete data.nextId;
        res.send(data);
        logger.info(`GET /account`);
    } catch(error) {
        next(error);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        const account = data.accounts.find(account => account.id === parseInt(req.params.id));
        res.send(account);
        logger.info(`GET /account/:id`);
 
    } catch(error) {
        next(error);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        const deleted = data.accounts.find(account => account.id === parseInt(req.params.id));
        logger.info(`DELETE /account/:id - ${JSON.stringify(deleted)}`);
        data.accounts = data.accounts.filter(account => account.id !== parseInt(req.params.id));
        await writeFile(global.fileName, JSON.stringify(data, null, 2));
        res.end();
    } catch (error) {
        next(error);
    }    
});

router.put("/", async (req, res, next) => {
    try {
        let account = req.body;

        const data = JSON.parse(await readFile(global.fileName));
        const index = data.accounts.findIndex(item => item.id === account.id);

        if (account.id || !account.name || !account.balance == null) {
            throw new Error("O ID, Nome e Balanço são obrigatórios");
        }

        if (index === -1) {
            throw new Error("Registro não encontrado!");
        }
        
        data.accounts[index].name = account.name;
        data.accounts[index].balance = account.balance;
        
        await writeFile(global.fileName, JSON.stringify(data, null, 2));
        res.send(account);

        logger.info(`PUT /account - ${JSON.stringify(account)}`);
    } catch (error) {
        next(error);
    }
});

router.patch("/updateBalance", async (req, res, next) => {
    try {
        let account = req.body;

        const data = JSON.parse(await readFile(global.fileName));
        const index = data.accounts.findIndex(item => item.id === account.id);

        if (index === -1) {
            throw new Error("Registro não encontrado!");
        }

        if (account.id || !account.balance == null) {
            throw new Error("O ID e o Balanço são obrigatórios!");
        }

        data.accounts[index].balance = account.balance;
        
        await writeFile(global.fileName, JSON.stringify(data));
        res.send(data.accounts[index]);

        logger.info(`PATCH /account/updateBalance - ${JSON.stringify(account)}`);
    } catch (error) {
        next(error);
    }
});

router.use((error, req, res, next) => {
    global.logger.error(`${ req.method } ${ req.baseUrl } - ${ error.message }`);
    res.status(400).send({ error: error.message });
})

export default router;