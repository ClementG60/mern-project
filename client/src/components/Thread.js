import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../actions/post.actions";
import Card from "./Post/Card";
import { isEmpty } from "./Utils";

const Thread = () => {
    const [loadPost, setLoadPost] = useState(true);
    const [count, setCount] = useState(5);
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.postReducer);

    const loadMore = () => {
        if (window.innerHeight + document.documentElement.scrollTop + 1 > document.scrollingElement.scrollHeight) {
            //vu que loadPost est dans le callback du useEffect, le useEffect sera relancé
            setLoadPost(true);
        }
    }

    useEffect(() => {
        if (loadPost) {
            dispatch(getPosts(count));
            setLoadPost(false);
            //on joue le setCount ici car le dispatch risque d'être plus rapide si on le mets au dessus de ce dernier
            setCount(count + 5);
        }
        window.addEventListener("scroll", loadMore);
        return () => window.removeEventListener("scroll", loadMore)
    }, [loadPost, dispatch, count])

    return (
        <div className="thread-container">
            <ul>
                {!isEmpty(posts) && (
                    posts.map((post) => {
                        return <Card post={post} key={post._id} />
                    })
                )}
            </ul>
        </div>
    );
};

export default Thread;