import React, { useContext, useEffect, useState } from "react";
import { UidContext } from "../AppContext";
//librairie permettant de gérer les pop-ups
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { likePost, unlikePost } from "../../actions/post.actions";
import {useDispatch} from "react-redux";

const LikeButton = ({ post }) => {
    const [liked, setLiked] = useState(false);
    const uid = useContext(UidContext);
    //dispatch permettra de trigger notre fonction
    const dispatch = useDispatch();

    const like = () => {
        dispatch(likePost(post._id, uid))
        setLiked(true);
    };

    const unlike = () => {
        dispatch(unlikePost(post._id, uid))
        setLiked(false);
    };

    //on relance le useEffect quand on a le uid, le post.likers ou quand liked change
    useEffect(() => {
        if (post.likers.includes(uid)) setLiked(true);
        else setLiked(false);
    }, [uid, post.likers, liked])

    return (
        <div className="like-container">
            {uid === null &&
                <Popup trigger={<img src="./img/icons/heart.svg" alt="like" />}
                    position={["bottom center", "bottom right", "bottom left"]}
                    closeOnDocumentClick>
                    <p>Connectez-vous pour aimer un post !</p>
                </Popup>
            }
            {uid && liked === false &&(
                <img src="./img/icons/heart.svg" alt="like" onClick={like}/>
            )}
             {uid && liked === true &&(
                <img src="./img/icons/heart-filled.svg" alt="unlike" onClick={unlike}/>
            )}
            <span>{post.likers.length}</span>
        </div>
    );
};

export default LikeButton;