const UserModel = require('../models/userModel');
//permet de vérifier les ids
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
    //on selectionne tout saud le password
    const users = await UserModel.find().select('-password');
    //on transmet le résultat contenu dans users
    res.status(200).json(users);
}

module.exports.getUserInfo = (req, res) => {
    //req.params permet de vérifier les données passés dans les requetes GET (pareil pour req.body pour les requetes POST)
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send('ID unknown :' + req.params.id);
    }

    UserModel.findById(req.params.id, (err, docs) => {
        if (!err) {
            res.send(docs);
        } else {
            console.log('Id unknown : ' + err);
        }
    }).select('-password')
}

module.exports.updateUser = async (req, res) => {
    //on vérifie si l'id existe
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send('ID unknown :' + req.params.id);
    }

    try {
        const filter = { _id: req.params.id };
        const update = {
            $set: {
                bio: req.body.bio
            }
        };

        //paramètre à mettre obligatoirement quand on fait un PUT
        const opts = {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
        };
        UserModel.findOneAndUpdate(
            filter,
            update,
            opts,
            (err, docs) => {
                if (!err) {
                    return res.send(docs);
                }
                if (err) {
                    res.status(500).send({ message: err });
                }
            }
        );
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
};

module.exports.deleteUser = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send('ID unknown :' + req.params.id);
    }

    try {
        UserModel.remove({ _id: req.params.id }).exec();
        res.status(200).json({ message: 'Succefully deleted.' })
    }
    catch (err) {
        return res.status(500).json({ message: err })
    }
};

module.exports.follow = async (req, res) => {
    if (!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.body.idToFollow)) {
        return res.status(400).send('ID unknown :' + req.params.id);
    }

    try {
        //on ajoute à la liste des followers
        UserModel.findByIdAndUpdate(
            req.params.id,
            //addToSet permet d'ajouter une donnée a un tableau si la valeur n'est pas présente, sinon elle ne fait rien
            { $addToSet: { following: req.body.idToFollow } },
            { new: true, upsert: true },
            (err, docs) => {
                if (!err) {
                    res.status(201).json(docs);
                } else {
                    return res.status(400).json(err);
                }
            }
        );
        //on ajoute à la liste des followings
        UserModel.findByIdAndUpdate(
            req.body.idToFollow,
            { $addToSet: { followers: req.params.id } },
            { new: true, upsert: true },
            (err, docs) => {
                //if (!err) { res.status(201).json(docs);} 
                if (err) {
                    return res.status(400).json(err);
                }
            }
        );
    }
    catch (err) {
        return res.status(500).json({ message: err })
    }
};

module.exports.unfollow = async (req, res) => {
    if (!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.body.idToUnfollow)) {
        return res.status(400).send('ID unknown :' + req.params.id);
    }

    try {
        //on enleve à la liste des followers
        UserModel.findByIdAndUpdate(
            req.params.id,
            //addToSet permet d'ajouter une donnée a un tableau si la valeur n'est pas présente, sinon elle ne fait rien
            { $pull: { following: req.body.idToUnfollow } },
            { new: true, upsert: true },
            (err, docs) => {
                if (!err) {
                    res.status(201).json(docs);
                } else {
                    return res.status(400).json(err);
                }
            }
        );
        //on enleve à la liste des followings
        UserModel.findByIdAndUpdate(
            req.body.idToUnfollow,
            { $pull: { followers: req.params.id } },
            { new: true, upsert: true },
            (err, docs) => {
                //if (!err) { res.status(201).json(docs);}
                //on ne peut retourner qu'un seul json
                if (err) {
                    return res.status(400).json(err);
                }
            }
        );
    }
    catch (err) {
        return res.status(500).json({ message: err })
    }
};