const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { signUpErrors, signInErrors } = require('../utils/errorsUtils')

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
    //la fonction sign prends en paramètre l'id, la variable d'environnement(pour décoder le token) et expiration(valable 3j)
    return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: maxAge })
}

module.exports.signUp = async (req, res) => {
    //on destructure, cad 
    const { pseudo, email, password } = req.body;

    try {
        //on ajoute notre utilisateur
        const user = await UserModel.create({ pseudo, email, password });
        res.status(201).json({ user: user._id });
    }
    catch (err) {
        const errors = signUpErrors(err);
        res.status(200).send({ errors });
    }
}

module.exports.signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.login(email, password);
        const token = createToken(user._id);
        //on utilise notre token à l'aide de la fonction cookie(nom du cookie, le token et les caractéristiques (httpOnly: true est pour la sécurité du cookie))
        res.cookie('jwt', token, { httpOnly: true, maxAge });
        res.status(201).json({ user: user._id, token});
    }
    catch (err) {
        const errors = signInErrors(err);
        res.status(200).send({ errors });
    }
}

module.exports.logout = async (req, res) => {
    //on définit notre cookie vide
    res.cookie('jwt', '', { maxAge: 1 });
    //on redirige
    res.redirect('/');
}