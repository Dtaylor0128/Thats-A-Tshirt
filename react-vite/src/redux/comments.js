// comments actions types
const SET_COMMENT = 'comments/setComment';
const SET_COMMENTS = 'comments/setComments';
const REMOVE_COMMENT = 'comments/removeComment';
const CLEAR_COMMENTS = 'comments/clearComments';

/// action creators
export const setComment = (comment) => ({
    type: SET_COMMENT,
    payload: comment
});

export const setComments = (comments) => ({
    type: SET_COMMENTS,
    payload: comments // array of comments
});

export const removeComment = (commentId) => ({
    type: REMOVE_COMMENT,
    payload: commentId
});

export const clearComments = () => ({
    type: CLEAR_COMMENTS
});

// Thunks
// GET one comment by id
export const thunkGetComment = (commentId) => async (dispatch) => {
    const response = await fetch(`/api/comments/${commentId}`);
    if (response.ok) {
        const comment = await response.json();
        dispatch(setComment(comment));
        return comment;
    } else {
        // handle error
        return { error: "Failed to fetch comment" };
    }
}
// GET many comments (for example, for a post's comments)
export const thunkGetComments = () => async (dispatch) => {
    const response = await fetch('/api/comments');
    if (response.ok) {
        const comments = await response.json();
        dispatch(setComments(comments));
        return comments;
    } else {
        // handle error
        return { error: "Failed to fetch comments" };
    }
}

// POST a new comment (creating a new comment)
export const thunkCreateComment = (commentData) => async (dispatch) => {
    const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData)
    });
    if (response.ok) {
        const newComment = await response.json();
        dispatch(setComment(newComment));
        return newComment;
    } else {
        // handle error
        return { error: "Failed to create comment" };
    }
}
// PUT (update) a comment
export const thunkUpdateComment = (commentId, updates) => async (dispatch) => {
    const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });

    if (response.ok) {
        const updatedComment = await response.json();
        dispatch(setComment(updatedComment));
        return updatedComment;
    } else {
        // handle error
        return { error: "Failed to update comment" };
    }
}

// DELETE a comment
export const thunkDeleteComment = (commentId) => async (dispatch) => {
    const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        dispatch(removeComment(commentId));
        return commentId;
    } else {
        // handle error
        return { error: "Failed to delete comment" };
    }
}

// Initial state
const initialState = {
    byId: {}, // stores comments by their id
    allIds: [] // stores all comment ids
};

// Reducer
export default function commentsReducer(state = initialState, action) {
    switch (action.type) {
        case SET_COMMENT: {
            const comment = action.payload;
            return {
                byId: { ...state.byId, [comment.id]: comment },
                allIds: state.allIds.includes(comment.id)
                    ? state.allIds
                    : [...state.allIds, comment.id]
            };
        }
        case SET_COMMENTS: {
            const comments = action.payload;
            const byId = {};
            const allIds = [];
            comments.forEach(comment => {
                byId[comment.id] = comment;
                if (!allIds.includes(comment.id)) {
                    allIds.push(comment.id);
                }
            });
            return { byId, allIds };
        }
        case REMOVE_COMMENT: {
            const commentId = action.payload;
            const newById = { ...state.byId };
            delete newById[commentId];
            return {
                byId: newById,
                allIds: state.allIds.filter(id => id !== commentId)
            };
        }

        case CLEAR_COMMENTS:
            return { ...initialState };
        default:
            return state;
    }
}