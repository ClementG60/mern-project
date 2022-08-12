import { DELETE_COMMENT, DELETE_POST, EDIT_COMMENT, GET_POSTS, LIKE_POST, UNLIKE_POST, UPDATE_POST } from "../actions/post.actions";

const initialState = {};

export default function postReducer(state = initialState, action) {
    switch (action.type) {
        case GET_POSTS:
            return action.payload;
        case LIKE_POST:
            //.map sert à identifier le post que l'utilisateur souhaite liker
            return state.map((post) => {
                if (post._id === action.payload.postId) {
                    return {
                        ...post,
                        //on ajoute notre nouveau likers au debut du tableau, sans l'écraser (à l'aide du spread opérateur ...)
                        likers: [action.payload.userId, ...post.likers]
                    }
                }
                return post;
            });
        case UNLIKE_POST:
            return state.map((post) => {
                if (post._id === action.payload.postId) {
                    return {
                        ...post,
                        //le filter va nous ressortir un tableau avec tous les valeurs qui ne correspondent par à l'userId
                        likers: post.likers.filter((id) => id !== action.payload.userId)
                    }
                }
                return post;
            });
        case UPDATE_POST:
            return state.map((post) => {
                if (post._id === action.payload.postId) {
                    return {
                        ...post,
                        message: action.payload.message
                    }
                }
                return post;
            });
        case DELETE_POST:
            return state.filter((post) => post._id !== action.payload.postId);
        case EDIT_COMMENT:
            return state.map((post) => {
                if (post._id === action.payload.postId) {
                    return {
                        ...post,
                        comments: post.comments.map((comment) => {
                            if (comment._id === action.payload.commentId) {
                                return {
                                    ...comment,
                                    text: action.payload.text
                                }
                            } else {
                                return comment;
                            }
                        })
                    }
                } else return post;

            });
        case DELETE_COMMENT:
            return state.map((post) => {
                if (post._id === action.payload.postId) {
                    return {
                        ...post,
                        comments: post.comments.filter((comment) => comment._id !== action.payload.commentId)
                    }
                } else return post;
            })
        default:
            return state;
    }
}