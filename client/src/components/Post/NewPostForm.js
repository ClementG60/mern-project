import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { isEmpty, timestampParser } from "../Utils";
import { NavLink } from "react-router-dom";
import { addPost, getPosts } from '../../actions/post.actions';

const NewPostForm = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [postPicture, setPostPicture] = useState(null);
    const [video, setVideo] = useState("");
    const [file, setFile] = useState();
    const userData = useSelector((state) => state.userReducer);
    const error = useSelector((state) => state.errorReducer.postError);
    const dispatch = useDispatch();

    const handlePost = async () => {
        if (message || postPicture || video) {
            const data = new FormData();
            data.append("posterId", userData._id);
            data.append("message", message);
            if (file) data.append("file", file)
            data.append("video", video);

            await dispatch(addPost(data));
            dispatch(getPosts());
            cancelPost();
        } else {
            alert("Veuillez entrer un message");
        }
    }; 

    const handlePicture = (e) => {
        //permet de prévisulaiser notre image
        setPostPicture(URL.createObjectURL(e.target.files[0]));
        console.log(e.target.files[0]);
        setFile(e.target.files[0]);
        setVideo(""); 
    };

    const cancelPost = () => {
        setMessage("");
        setPostPicture("");
        setVideo("");
        setFile("");
    };

    const handleVideo = () => {
        let findLink = message.split(" ");
        for (let i = 0; i < findLink.length; i++) {
            if(findLink[i].includes("https://www.yout") || findLink[i].includes("https://.yout")) {
                //on remplace pour que iframe fonctionne
                let embed = findLink[i].replace("watch?v=", "embed/");
                //on retire ce qu'il y a après le & (comme le temps par exemple)
                setVideo(embed.split("&")[0]);
                //on retire le lien du tableau
                findLink.splice(i, 1);
                //on définit le message sans le lien 
                setMessage(findLink.join(" "));
                //on définit le postPicture à null
                setPostPicture("")
            }
        }
    }

    useEffect(() => {
        if (!isEmpty(userData)) setIsLoading(false);
        handleVideo();
    }, [userData, message, video, handleVideo ])

    return (

        <div className="post-container">
            {isLoading ? (
                <i className="fas fa-spinner fa-pulse"></i>
            ) : (
                <>
                    <div className="data">
                        <p><span>{userData.following ? userData.following.length : 0}</span> Abonnement{userData.following && userData.following.length > 1 ? "s" : null}</p>
                        <p><span>{userData.followers ? userData.followers.length : 0}</span> Abonné{userData.followers && userData.followers.length > 1 ? "s" : null}</p>
                    </div>
                    <NavLink to="/profil">
                        <div className="user-info">
                            <img src={userData.picture} alt="user-img" />
                        </div>
                    </NavLink>
                    <div className="post-form">
                        <textarea name="message" id="message" placeholder="Quoi de neuf ?" onChange={(e) => setMessage(e.target.value)} value={message}></textarea>
                        {message || postPicture ||video.length > 20 ? (
                            <li className="card-container">
                                <div className="card-left">
                                    <img src={userData.picture} alt="user-pic" />
                                </div>
                                <div className="card-right">
                                    <div className="card-header">
                                        <div className="pseudo">
                                            <h3>{userData.pseudo}</h3>
                                        </div>
                                        <span>{timestampParser(Date.now())}</span>
                                    </div>
                                    <div className="content">
                                        <p>{message}</p>
                                        <img src={postPicture} alt="" />
                                        {video && (
                                            <iframe src={video} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-hand" allowFullScreen ></iframe>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ) : null }
                        <div className="footer-form">
                            <div className="icon">
                                {isEmpty(video) && (
                                    <>
                                        <img src="./img/icons/picture.svg" alt="image" />
                                        <input type="file" name="file" id="file-upload" accept=".jpg, .jpeg, .png" onChange={(e) => handlePicture(e)} />
                                    </>
                                )}
                                {video && (
                                    <button onClick={() => setVideo("")}>Supprimer la vidéo</button>
                                )}
                            </div>
                            {!isEmpty(error.format) && <p>{error.format}</p>}
                            {!isEmpty(error.maxSize) && <p>{error.maxSize}</p>}
                            <div className="btn-send">
                                {message || postPicture || video.length > 20 ? (
                                    <button className="cancel" onClick={cancelPost}>Annuler le message</button>
                                ) : null}
                                <button className="send" onClick={handlePost}>Envoyer</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NewPostForm;