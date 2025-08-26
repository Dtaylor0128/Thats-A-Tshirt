// comments actions types
const LOAD_COMMENTS = 'comments/LOAD_COMMENTS';          // fetch multiple comments
const UPLOAD_COMMENT = 'comments/UPLOAD_COMMENT';        // fetch/create/replace a single comment
const CREATE_COMMENT = 'comments/CREATE_COMMENT';        // create a single comment (used after POST)
const UPDATE_COMMENT = 'comments/UPDATE_COMMENT';        // update a single comment (used after PUT/PATCH)
const DELETE_COMMENT = 'comments/DELETE_COMMENT';        // delete by id
/// action creators
export const loadComments = (comments) => ({
    type: LOAD_COMMENTS,
    comments
});
export const uploadComment = (comment) => ({
    type: UPLOAD_COMMENT,
    comment
});

export const createComment = (comment) => ({
    type: CREATE_COMMENT,
    comment
});
export const updateComment = (comment) => ({
    type: UPDATE_COMMENT,
    comment
});
export const deleteComment = (commentId) => ({
    type: DELETE_COMMENT,
    commentId
});

// Thunks
// GET one comment by id
export const thunkGetComment = (id) => async dispatch => {
    const response = await fetch(`/api/comments/${id}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(uploadComment(data.comment));  // uses UPLOAD_COMMENT for single fetch
        return data.comment;
    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages;
    } else {
        return { server: "Something went wrong. Please try again" };
    }
};


// GET many comments (for example, for a post's comments)
export const thunkGetComments = (postId) => async dispatch => {
    const response = await fetch(`/api/posts/${postId}/comments`);
    if (response.ok) {
        const data = await response.json();
        dispatch(loadComments(data.comments));
        return data.comments;
    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages;
    } else {
        return { server: "Something went wrong. Please try again" };
    }
};

// POST a new comment (creating a new comment)
export const thunkCreateComment = (postId, commentData) => async dispatch => {
    const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData),
        credentials: 'include'
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(createComment(data.comment));
        return data.comment;
    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages;
    } else {
        return { server: "Something went wrong. Please try again" };
    }
};

// PUT (update) a comment
export const thunkUpdateComment = (id, updates) => async dispatch => {
    const response = await fetch(`/api/comments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
        credentials: 'include'
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(updateComment(data.comment));
        return data.comment;
    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages;
    } else {
        return { server: "Something went wrong. Please try again" };
    }
};

// DELETE a comment
export const thunkDeleteComment = (id) => async dispatch => {
    const response = await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (response.ok) {
        dispatch(deleteComment(id));
        return id;
    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages;
    } else {
        return { server: "Something went wrong. Please try again" };
    }
};

// Initial state
const initialState = {
    byId: {}, // stores comments by their id
    allIds: [] // stores all comment ids
};

// Reducer
export default function commentsReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_COMMENTS: {
            const newById = {};
            const newAllIds = [];
            action.comments.forEach(comment => {
                newById[comment.id] = comment;
                newAllIds.push(comment.id);
            });
            return { ...state, byId: newById, allIds: newAllIds };
        }
        case UPLOAD_COMMENT:
        case CREATE_COMMENT:
        case UPDATE_COMMENT: {
            const comment = action.comment;
            return {
                ...state,
                byId: { ...state.byId, [comment.id]: comment },
                allIds: state.allIds.includes(comment.id)
                    ? state.allIds
                    : [...state.allIds, comment.id]
            };
        }
        case DELETE_COMMENT: {
            const { commentId } = action;
            // eslint-disable-next-line no-unused-vars
            const { [commentId]: _removed, ...newById } = state.byId;
            return {
                ...state,
                byId: newById,
                allIds: state.allIds.filter(id => id !== commentId)
            };
        }
        default:
            return state;
    }
}