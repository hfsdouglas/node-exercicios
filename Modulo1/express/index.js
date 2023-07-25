import express from "express";
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/', (req, res) => {
    const a = 3;
    const b = 5;
    const resultado = soma(a, b);

    res.send("Resultado: " + resultado);
});

function soma(a, b) {
    return a + b;
}

app.listen(4000, () => {
    console.log("API iniciada");
});