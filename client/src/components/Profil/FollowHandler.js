import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { followUser, unfollowUser } from "../../actions/user.actions";
import { isEmpty } from "../Utils";

const FollowHandler = ({ idToFollow, type }) => {
    const userData = useSelector((state) => state.userReducer);
    const [isFollowed, setIsFollowed] = useState(false);
    const dispatch = useDispatch();

    const handleFollow = () => {
        dispatch(followUser(userData._id, idToFollow));
        setIsFollowed(true)
    };

    const handleUnfollow = () => {
        dispatch(unfollowUser(userData._id, idToFollow));
        setIsFollowed(false);
    };

    //le useEffect se déclenche à chaque fois que le composant est appellé. Le callback sert à relancer le useEffect dès que le userData est mis à jour
    useEffect(() => {
        if (!isEmpty(userData.following)) {
            if (userData.following.includes(idToFollow)) {
                setIsFollowed(true);
            } else setIsFollowed(false);
        }
    }, [userData, idToFollow]);

    return (
        <>
            {isFollowed && !isEmpty(userData) && (
                <span onClick={handleUnfollow}>
                    {type === "suggestion" && <button className="unfollow-btn">Abonnés</button>}
                    {type === "card" && <img src="./img/icons/checked.svg" alt="checked"/>}
                </span>
            )}
            {isFollowed === false && !isEmpty(userData) && (
                <span onClick={handleFollow}>
                    {type === "suggestion" && <button className="follow-btn">Suivre</button>}
                    {type === "card" && <img src="./img/icons/check.svg" alt="check"/>}
                </span>
            )}
        </>
    );
};

export default FollowHandler;