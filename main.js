const express = require('express');
const bodyParser = require('body-parser');
const bibliotecaRoutes = require('./routes/biblioteca');

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use('/biblioteca', bibliotecaRoutes);

app.listen(port, () => {
    console.log(`Servidor iniciado na porta: ${port}`);
});
