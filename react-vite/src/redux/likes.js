

// likes action types
const LOAD_LIKES = 'likes/LOAD_LIKES';          // fetch multiple likes
const UPLOAD_LIKE = 'likes/UPLOAD_LIKE';        // fetch/create/replace a single like
const CREATE_LIKE = 'likes/CREATE_LIKE';        // create a single like (used after POST)
const UPDATE_LIKE = 'likes/UPDATE_LIKE';        // update a single like (used after PUT/PATCH)
const DELETE_LIKE = 'likes/DELETE_LIKE';

// action creators
export const loadLikes = (likes) => ({
    type: LOAD_LIKES,
    likes
});
export const uploadLike = (like) => ({
    type: UPLOAD_LIKE,
    like
});
export const createLike = (like) => ({
    type: CREATE_LIKE,
    like
});
export const updateLike = (like) => ({
    type: UPDATE_LIKE,
    like
});
export const deleteLike = (likeId) => ({
    type: DELETE_LIKE,
    likeId
});

// Thunks
// GET one like by id
export const thunkGetLike = (id) => async dispatch => {
    const response = await fetch(`/api/likes/${id}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(uploadLike(data.like));  // uses UPLOAD_LIKE for single fetch
        return data.like;
    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages;
    } else {
        return { server: "Something went wrong. Please try again" };
    }
};

// GET many likes (for example, for a post's likes)
export const thunkGetLikes = () => async dispatch => {
    const response = await fetch('/api/likes');
    if (response.ok) {
        const data = await response.json();
        const likesArray = Array.isArray(data) ? data : data.likes;
        dispatch(loadLikes(likesArray));
        return likesArray;
    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages;
    } else {
        return { server: "Something went wrong. Please try again" };
    }
};

// POST a new like (creating a new like)
export const thunkCreateLike = (likeData) => async dispatch => {
    const response = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(likeData),
        credentials: 'include'
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(createLike(data.like));
        return data.like;
    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages;
    } else {
        return { server: "Something went wrong. Please try again" };
    }
};

// DELETE a like (removing a like)
export const thunkDeleteLike = (id) => async dispatch => {
    const response = await fetch(`/api/likes/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (response.ok) {
        dispatch(deleteLike(id));
        return id;
    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages;
    } else {
        return { server: "Something went wrong. Please try again" };
    }
};

// PUT to update a like (editing an existing like)
export const thunkUpdateLike = (id, updates) => async dispatch => {
    const response = await fetch(`/api/likes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
        credentials: 'include'
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(updateLike(data.like));
        return data.like;
    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages;
    } else {
        return { server: "Something went wrong. Please try again" };
    }
};

//initial state
const initialState = {
    byId: {},
    allIds: []
};

// reducer
export default function likesReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_LIKES: {
            const newById = {};
            const newAllIds = [];
            action.likes.forEach(like => {
                newById[like.id] = like;
                newAllIds.push(like.id);
            });
            return { ...state, byId: newById, allIds: newAllIds };
        }
        case UPLOAD_LIKE:
        case CREATE_LIKE:
        case UPDATE_LIKE: {
            const like = action.like;
            return {
                ...state,
                byId: { ...state.byId, [like.id]: like },
                allIds: state.allIds.includes(like.id)
                    ? state.allIds
                    : [...state.allIds, like.id]
            };
        }
        case DELETE_LIKE: {
            const { likeId } = action;
            // eslint-disable-next-line no-unused-vars
            const { [likeId]: _, ...newById } = state.byId;
            return {
                ...state,
                byId: newById,
                allIds: state.allIds.filter(id => id !== likeId)
            };
        }
        default:
            return state;
    }
}