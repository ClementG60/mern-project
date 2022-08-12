const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

//on mets un next dans le fonction pour poursuivre le code après l'execution de la fonction
module.exports.checkUser = (req, res, next) => {
    //on recupère ce que l'on a dans notre cookie
    const token = req.cookies.jwt;
    //si le token existe
    if (token) {
        //methode de jwt pour vérifier le cookie
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            //si il y a une erreur
            if (err) {
                //.locals sont des données temporaires de notre requete
                res.locals.user = null;
                // res.cookie('jwt', '', { maxAge: 1 });
                next()
            } else {
                let user = UserModel.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
};

module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
        if (err) {
          console.log(err);
          res.send(200).json('no token')
        } else {
          res.status(200).json(decodedToken.id);
          next();
        }
      });
    } else {
      console.log('No token');
    }
  };