require('dotenv').config();
const express = require('express');
const app = express();

const mongoose = require('mongoose');

const personRoutes = require('./routes/personRoutes');

app.use(
    express.urlencoded({
        extended: true,
    }),
)

app.use(express.json());

app.use('/person', personRoutes);

app.get('/', (req, res) => {

    res.json({message: 'Olá express'});
});

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
// caso a senha tenha algum simbulo especial, podemos passar toda a declaração dela acima como argumento de encodedURIComponent(). Essa função anulara os efeitos dos caracteres especiais.

mongoose
    .connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@apicluster.1rgec.mongodb.net/bancoDaApi?retryWrites=true&w=majority`)
    .then( () => {
        console.log('conectamos ao mongoDb');
        app.listen(3000);
    })
    .catch((erro) => console.log(erro));
