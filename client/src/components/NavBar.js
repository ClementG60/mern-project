import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UidContext } from "./AppContext";
import Logout from "./Log/Logout";
import { useSelector } from "react-redux";

const NavBar = () => {
    const uid = useContext(UidContext);
    //on recupère le state de userReducer
    const userData = useSelector((state) => state.userReducer);

    console.log(userData);

    return (
        <nav>
            <div className="nav-container">
                <div className="logo">
                    <NavLink to="/">
                        <div className="logo">
                            <img src="./img/icon.png" alt="icon" />
                            <h3>Raccoont</h3>
                        </div>
                    </NavLink>
                </div>
                {uid ? (
                    <ul>
                        <li></li>
                        <li className="welcome">
                            <NavLink to="/profil">
                                <h5>Bienvenue {userData.pseudo}</h5>
                            </NavLink>
                        </li>
                        <Logout />
                    </ul>
                ) : (
                    <ul>
                        <li></li>
                        <li>
                            <NavLink to="/profil">
                                <img src="./img/icons/login.svg" alt="login" />
                            </NavLink>
                        </li>
                    </ul>
                )}
            </div>
        </nav>
    );
};

export default NavBar;