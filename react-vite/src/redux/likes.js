

// likes action types
const SET_LIKE = 'likes/setLike';
const SET_LIKES = 'likes/setLikes';
const REMOVE_LIKE = 'likes/removeLike';
const CLEAR_LIKES = 'likes/clearLikes';

// action creators
export const setLike = (like) => ({
    type: SET_LIKE,
    payload: like
});

export const setLikes = (likes) => ({
    type: SET_LIKES,
    payload: likes // array of likes
});

export const removeLike = (likeId) => ({
    type: REMOVE_LIKE,
    payload: likeId
});

export const clearLikes = () => ({
    type: CLEAR_LIKES
});

// Thunks
// GET one like by id
export const thunkGetLike = (likeId) => async (dispatch) => {
    const response = await fetch(`/api/likes/${likeId}`);
    if (response.ok) {
        const like = await response.json();
        dispatch(setLike(like));
        return like;
    } else {
        // handle error
        return { error: "Failed to fetch like" };
    }
}

// GET many likes (for example, for a post's likes)
export const thunkGetLikes = () => async (dispatch) => {
    const response = await fetch('/api/likes');
    if (response.ok) {
        const likes = await response.json();
        dispatch(setLikes(likes));
        return likes;
    } else {
        // handle error
        return { error: "Failed to fetch likes" };
    }
}

// POST a new like (creating a new like)
export const thunkCreateLike = (likeData) => async (dispatch) => {
    const response = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(likeData)
    });
    if (response.ok) {
        const like = await response.json();
        dispatch(setLike(like));
        return like;
    } else {
        // handle error
        return { error: "Failed to create like" };
    }
}

// DELETE a like (removing a like)
export const thunkDeleteLike = (likeId) => async (dispatch) => {
    const response = await fetch(`/api/likes/${likeId}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        dispatch(removeLike(likeId));
        return likeId;
    } else {
        // handle error
        return { error: "Failed to delete like" };
    }
}

// PUT to update a like (editing an existing like)
export const thunkUpdateLike = (likeId, updates) => async (dispatch) => {
    const response = await fetch(`/api/likes/${likeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });

    if (response.ok) {
        const updatedLike = await response.json();
        dispatch(setLike(updatedLike));
        return updatedLike;
    } else {
        // handle error
        return { error: "Failed to update like" };
    }
}

//initial state
const initialState = {
    byId: {},
    allIds: []
};

// reducer
export default function likesReducer(state = initialState, action) {
    switch (action.type) {
        case SET_LIKE: {
            const like = action.payload;
            return {
                ...state,
                byId: { ...state.byId, [like.id]: like },
                allIds: state.allIds.includes(like.id)
                    ? state.allIds
                    : [...state.allIds, like.id]
            };
        }
        case SET_LIKES: {
            const likes = action.payload;
            const newById = {};
            const newAllIds = [];
            likes.forEach(like => {
                newById[like.id] = like;
                newAllIds.push(like.id);
            });
            return {
                byId: newById,
                allIds: newAllIds
            };
        }
        case REMOVE_LIKE: {
            const likeId = action.payload;
            const newById = { ...state.byId };
            delete newById[likeId];
            return {
                byId: newById,
                allIds: state.allIds.filter(id => id !== likeId)
            };

        }
        case CLEAR_LIKES:
            return { ...initialState };
        default:
            return state;
    }
}