import express from "express";
import carrosRouter from "./carrosRouter.js";

const app = express();

app.use(express.json());
app.use((req, res, next) => {
    console.log(new Date());
    next();
});
app.use("/carros", carrosRouter);

app.get('/teste', (req, res) => {
    res.end();
});

app.listen(4000, () => {
    console.log("API iniciada");
});

