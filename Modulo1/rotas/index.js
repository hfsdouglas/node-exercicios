import express from "express";
const app = express();

app.use(express.json());

// All
app.all('/testAll', (req, res) => {
    res.send(req.method);
});

// Caracteres especiais
app.get('/teste?', (_req, res) => {
    res.send("/teste?");
});

app.get('/buzz+', (_req, res) => {
    res.send("/buzz+");
});

app.get('/one*Blue', (req, res) => {
    res.send(req.path);
});

app.post('/test(ing)?', (req, res) => {
    console.log(req.body);
    res.send("/test(ing)?");
});

app.get(/.*Red$/, (_req, res) => {
    res.send('/.*Red$/');
});

// Parametros na rota
app.get('/testParam/:id', (req, res) => {
    res.send(req.params.id);
});

// Parâmentros via Query
app.get('/testQuery', (req, res) => {
    res.send(req.query);
});

// Next
app.get('/testMultipleHandlers', (req, res, next) => {
    console.log('Callback 1');
    next();
}, (req, res) => {
    console.log('Callback 2');
    res.send("Alguma coisa");
    // Ou pode usar res.end() para finalizar
});

// Next com Array
const callback1 = (req, res, next) => {
    console.log('Callback 1');
    next();
};

function callback2(req, res, next) {
    console.log('Callback 2');
    next();
};

const callback3 = (req, res) => {
    console.log('Callback 3');
    res.end();
};

app.get('/testMultipleHandlersArray', [callback1, callback2, callback3]);

// Route 
app.route('/testRoute')
    .get((req, res) => {
        res.send("/testRoute GET");
    })
    .post((req, res) => {
        res.send("/testRoute POST");
    })
    .delete((req, res) => {
        res.send("/testRoute DELETE");
    });

app.listen(4000, () => {
    console.log("API Iniciada");
});