const PostModel = require('../models/postModel');
const UserModel = require('../models/userModel');
const ObjectId = require('mongoose').Types.ObjectId;
const { uploadErrors } = require('../utils/errorsUtils');
const fs = require('fs');
//extension node qui permet d'incrémenter des fichiers
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);

module.exports.readPost = (req, res) => {
    //sort( { createdAt: -1}) permet de trier du plus recent au plus ancien (utile pour un réseau social)
    PostModel.find((err, docs) => {
        if (!err) res.send(docs);
        else console.log('Error to get data : ' + err);
    }).sort({ createdAt: -1 });
};

module.exports.createPost = async (req, res) => {
    let fileName;

    if (req.file != null) {
        try {
            if (
                req.file.detectedMimeType != "image/jpg" &&
                req.file.detectedMimeType != "image/png" &&
                req.file.detectedMimeType != "image/jpeg"
            )
                throw Error("invalid file");

            if (req.file.size > 500000) throw Error("max size");
        } catch (err) {
            const errors = uploadErrors(err);
            return res.status(201).json({ errors });
        }
        fileName = req.body.posterId + Date.now() + '.jpg';

        await pipeline(
            req.file.stream,
            fs.createWriteStream(
                `${__dirname}/../client/public/uploads/posts/${fileName}`
            )
        )
    }

    const newPost = new PostModel({
        posterId: req.body.posterId,
        message: req.body.message,
        picture: req.file != null ? './uploads/posts/' + fileName : '',
        video: req.body.video,
        likers: [],
        comments: []
    });

    try {
        const post = await newPost.save();
        return res.status(201).json(post);
    }
    catch (err) {
        return res.status(400).send(err);
    }
};

module.exports.updatePost = (req, res) => {
    //on vérifie si l'id existe
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send('ID unknown :' + req.params.id);
    }

    const updatedRecord = {
        message: req.body.message
    };

    PostModel.findByIdAndUpdate(
        req.params.id,
        { $set: updatedRecord },
        { new: true },
        (err, docs) => {
            if (!err) res.send(docs);
            else console.log('Update error : ' + err);
        }
    );
};

module.exports.deletePost = (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send('ID unknown :' + req.params.id);
    }

    PostModel.findByIdAndRemove(
        req.params.id,
        (err, docs) => {
            if (!err) res.send(docs);
            else console.log('Delete error : ' + err);
        }
    );
};

module.exports.likePost = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send('ID unknown :' + req.params.id);
    }

    try {
        PostModel.findByIdAndUpdate(
            req.params.id,
            //on ajoute l'id de la personne qui a liké le post
            { $addToSet: { likers: req.body.id } },
            { new: true },
            (err, docs) => {
                if (err) res.status(400).send(err);
            }
        );
        UserModel.findByIdAndUpdate(
            req.body.id,
            { $addToSet: { likes: req.params.id } },
            { new: true },
            (err, docs) => {
                if (!err) res.send(docs);
                else res.status(400).send('ID unknown : ' + err);
            }
        )
    } catch (err) {
        res.status(400).send('ID unknown : ' + err)
    }

};

module.exports.unlikePost = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send('ID unknown :' + req.params.id);
    }

    try {
        PostModel.findByIdAndUpdate(
            req.params.id,
            //on retire l'id de la personne qui a liké le post
            { $pull: { likers: req.body.id } },
            { new: true },
            (err, docs) => {
                if (err) res.status(400).send(err);
            }
        );
        UserModel.findByIdAndUpdate(
            req.body.id,
            { $pull: { likes: req.params.id } },
            { new: true },
            (err, docs) => {
                if (!err) res.send(docs);
                else res.status(400).send('ID unknown : ' + err);
            }
        )
    } catch (err) {
        res.status(400).send('ID unknown : ' + err)
    }
};

module.exports.commentPost = (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send('ID unknown :' + req.params.id);
    }

    try {
        PostModel.findByIdAndUpdate(
            req.params.id,
            //on utilise push pour ajouter à notre tableau, et ne pas écraser
            {
                $push: {
                    comments: {
                        commenterId: req.body.commenterId,
                        commenterPseudo: req.body.commenterPseudo,
                        text: req.body.text,
                        timestamp: new Date().getTime()
                    }
                }
            },
            { new: true },
            (err, docs) => {
                if (!err) return res.send(docs);
                else return res.status(400).send(err);
            }
        );
    } catch (err) {
        return res.status(400).err;
    }
};

module.exports.editCommentPost = (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send('ID unknown :' + req.params.id);
    }

    try {
        PostModel.findById(
            //on pointe vers le post
            req.params.id,
            (err, docs) => {
                //on récupère et vérifie l'id du commentaire sur le post (!!!! ne pas oublier le return sur le find())
                const theComment = docs.comments.find((comment) => {
                    return comment._id == req.body.commentId;
                });
                //si le commentaire n'existe plus, on renvoie une erreur
                if (!theComment) return res.status(404).send('Comment not found');
                //sinon on remplace le texte du commentaire ave celui de notre request
                theComment.text = req.body.text;
                //on mets à jour le commentaire à l'aide du .save
                return docs.save((err) => {
                    if (!err) return res.status(200).send(docs);
                    res.status(500).send(err);
                })
            }
        )
    } catch (err) {
        return res.status(400).err;
    }
};

module.exports.deleteCommentPost = (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send('ID unknown :' + req.params.id);
    }

    try {
        PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    comments: {
                        _id: req.body.commentId
                    }
                }
            },
            { new: true },
            (err, docs) => {
                if (!err) return res.send(docs);
                else return res.status(400).send(err);
            }
        )
    } catch (err) {
        return res.status(400).send(err);
    }
};
