import express from "express";
const app = express();

app.all('/testAll', (req, res) => {
    res.send(req.method);
});

app.get('/teste?', (_req, res) => {
    res.send("/teste?");
});

app.get('/buzz+', (_req, res) => {
    res.send("/buzz+");
});

app.listen(4000, () => {
    console.log("API Iniciada");
});