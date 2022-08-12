import React, { useEffect, useState } from "react";
import Routes from "./components/routes"
import { UidContext } from "./components/AppContext";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getUser } from "./actions/user.actions";

const App = () => {
  const [uid, setUid] = useState(null);
  //sert à declencher une action
  const dispatch = useDispatch();
  //permet de stocker le token de l"utilisateur au plus haut dans l"appli, afin de pouvoir le réutilisé
  useEffect(() => {
    const fetchToken = async () => {
      await axios({
        method: "get",
        url: `${process.env.REACT_APP_API_URL}jwtid`,
        withCredentials: true
      })
        .then((res) => {
          setUid(res.data);
        })
        .catch((err) => console.log("No token"));
    };
    //on appelle la fonction pour récuperer le token
    fetchToken();

    //si uid est défini, alors on récupère les données de l"utilisateur à l"aide de redux
    if (uid) dispatch(getUser(uid));
  },  [uid, dispatch])

  return (
    //UidContext permet de stocker l"id de l"utilisateur
    <div>
      <UidContext.Provider value={uid} >
        <Routes />
      </UidContext.Provider>
    </div>
  );
};

export default App;
