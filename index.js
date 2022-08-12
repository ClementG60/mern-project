//on récupère express
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
//on récupère le PORT de notre fichier env
require('dotenv').config({ path: './config/.env' });
require('./config/dbConfig');
const { checkUser, requireAuth } = require('./middleware/authMiddleware');
const cors = require('cors');

const app = express();

//on crée un objet permettant d'autoriser les requetes
const corsOption = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
};

//middleware
//CORS permet de faire des requetes à notre API. app.use(cors()), on autorise tout le monde à faire des requetes. 
//Dans ce cas précis, on autorise juste le client à nous faire des requetes via une variable d'environnement
app.use(cors(corsOption));
//sert à mettre la requête au bon format et à traiter la data d'un point A à un point B
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//sert à lire le cookie
app.use(cookieParser());

//jwt
app.get('*', checkUser);
app.get('/jwtid', requireAuth);

//routes
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

//server
//sert à lire sur un port spécifique
app.listen(5000, () => {
  console.log(`Listening on port ${process.env.PORT}`);
})