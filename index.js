const express = require('express');
const routes = require('./routes');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config({path: 'variables.env'});
// Cors permite que un cliente se conecta a otro servidor para el intercambio de recursos

const cors = require('cors');

// conectar mongo
// mongoose.Promise = global.Promise;

// mongoose.connect('mongodb+srv://luis:1234@cluster0-2dg8m.mongodb.net/api?retryWrites=true&w=majority', {
//     useNewUrlParser: true
// });

mongoose.connect(process.env.DB_URL,{
    useNewUrlParser: true
}).then(db=> console.log('ok')).catch(e => console.log(e));


//

// crear el servidor
const app = express();

app.use(express.static('uploads'));
// habilitar bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const whiteList = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: (origin, callback) => {
        //revisar si es permitido
        // console.log(origin);
        const existe = whiteList.some(dominio => dominio === origin);

        if (existe) {
            callback(null, true);
        }else{
            callback(new Error('No permitido por Cors'));
        }
    }
}

// Habilitar cors
app.use(cors(corsOptions));

// Rutas de la app
app.use('/', routes());

// carpeta publica

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 5000;

// puerto
app.listen(port, host, ()=> {
    console.log('el server esta funcionando')
});