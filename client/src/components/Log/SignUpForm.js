import React, { useState } from "react";
import axios from "axios";
import SignInForm from "./SignInForm";

const SignUpForm = () => {
    const [formSubmit, setFormSubmit] = useState(false);
    const [pseudo, setPseudo] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [controlPassword, setControlPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        const pseudoError = document.querySelector(".pseudo.error");
        const emailError = document.querySelector(".email.error");
        const passwordError = document.querySelector(".password.error");
        const controlPasswordError = document.querySelector(".controlPassword.error");
        const termsError = document.querySelector(".terms.error");
        const terms = document.getElementById("terms");

        controlPasswordError.innerHTML = "";
        termsError.innerHTML = "";

        if (password !== controlPassword || !terms.checked) {
            if (password !== controlPassword) {
                controlPasswordError.innerHTML = "Les mots de passe ne correspondent pas."
            }

            if (!terms.checked) {
                termsError.innerHTML = "Veuillez valider les CG."
            }
        } else {
            await axios({
                method: "post",
                url: `${process.env.REACT_APP_API_URL}api/user/register`,
                data: {
                    pseudo,
                    email,
                    password
                },
                withCredentials: true
            })
                .then((res) => {
                    if (res.data.errors) {
                        pseudoError.innerHTML = res.data.errors.pseudo;
                        emailError.innerHTML = res.data.errors.email;
                        passwordError.innerHTML = res.data.errors.password;
                    } else {
                        setFormSubmit(true);
                    }
                })
                .catch((err) => console.log(err))
        }
    } 
    return (
        <>
            {formSubmit ? (
                <>
                    <SignInForm />
                    <h4 className="success">Enregistrement réussi, veuillez-vous connecter</h4>
                </>
            ) : (
                <form action="" onSubmit={handleRegister} id="signUpForm">
                    <label htmlFor="pseudo">Pseudo</label>
                    <input type="text" name="pseudo" id="pseudo" onChange={(e) => setPseudo(e.target.value)} value={pseudo} />
                    <div className="pseudo error"></div>
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" id="email" onChange={(e) => setEmail(e.target.value)} value={email} />
                    <div className="email error"></div>
                    <label htmlFor="password">Mot de passe</label>
                    <input type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)} value={password} />
                    <div className="password error"></div>
                    <label htmlFor="controlPassword">Confirmer le mot de passe</label>
                    <input type="password" name="controlPassword" id="controlPassword" onChange={(e) => setControlPassword(e.target.value)} value={controlPassword} />
                    <div className="controlPassword error"></div>
                    <input type="checkbox" name="terms" id="terms" />
                    <label htmlFor="terms">J"accepte les <a href="_blank" target="_blank" rel="noopener noreferrer">conditions générales</a></label>
                    <div className="terms error"></div>
                    <input type="submit" value="Valider l'inscription" />
                </form>
            )}

        </>
    );
};

export default SignUpForm;