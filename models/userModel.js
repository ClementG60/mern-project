const mongoose = require('mongoose');
//on appelle la fonction isEmail de la biblio validator
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

//Schema est un objet de la biblio mongosse, nous permettant de définir nos données
const userSchema = new mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 55,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail],
      lowercase: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      minlength: 6
    },
    picture: {
      type: String,
      default: "./uploads/profil/random-user.png"
    },
    bio: {
      type: String,
      max: 1024
    },
    followers: {
      type: [String]
    },
    following: {
      type: [String]
    },
    likes: {
      type: [String]
    }
  },
  {
    timestamps: true
  }
)

//on joue une fonction avant la sauvegarde dans le db
userSchema.pre('save', async function(next) {
  //on vient saler notre mdp
  //await permet d'attendre la résolution d'une promesse (uniquement dans les fonctions asynchrone)
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt)
  //next permet de passer à la suite
  next();
});

//quand on va tenter de se log
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('Incorrect password');
  }
  throw Error('Incorrect email');
}

//on exporte notre modèle, avec comme paramètre notre table et le schéma
const UserModel = mongoose.model('user', userSchema);
//on exporte notre modèle
module.exports = UserModel;
