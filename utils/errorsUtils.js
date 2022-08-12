module.exports.signUpErrors = (err) => {
    let errors = { pseudo: '', email: '', password: ''};

    if (err.message.includes('pseudo')) {
        errors.pseudo = 'Ce pseudo incorrect.';
    };

    if (err.message.includes('email')) {
        errors.email = 'Cet email incorrect.';
    };

    //Object.keys permet de pointer vers le err.keyValue
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('email')) {
        errors.email = 'Cet email est déjà utilisé.';
    };

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('pseudo')) {
        errors.email = 'Ce pseudo est déjà utilisé.';
    };

    if(err.message.includes('password')) {
        errors.password = 'Le mot de passe doit faire 6 caractères minimum. ';
    };

    return errors;
};

module.exports.signInErrors = (err) => {
    let errors = { email: '', password: ''};

    if (err.message.includes('email')) {
        errors.email = 'L\'email est inconnu.';
    }

    if (err.message.includes('password')) {
        errors.password = 'Le mot de passe ne correspond pas.';
    }

    return errors;
};

module.exports.uploadErrors = (err) => {
    let errors = { format: '', maxSize: ''};

    if (err.message.includes('invalid file')) {
        errors.format = 'Format incompatible';
    }

    if (err.message.includes('max size')) {
        errors.format = 'La taille de l\'image est trop grande. (500Ko max)';
    }

    return errors;
}