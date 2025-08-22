// follow action types
const SET_FOLLOW = 'follows/setFollow';
const SET_FOLLOWS = 'follows/setFollows';
const REMOVE_FOLLOW = 'follows/removeFollow';
const CLEAR_FOLLOWS = 'follows/clearFollows';

// action creators
export const setFollow = (follow) => ({
    type: SET_FOLLOW,
    payload: follow
});

export const setFollows = (follows) => ({
    type: SET_FOLLOWS,
    payload: follows // array of follows
});

export const removeFollow = (followId) => ({
    type: REMOVE_FOLLOW,
    payload: followId
});

export const clearFollows = () => ({
    type: CLEAR_FOLLOWS
});


// Thunks
// GET one follow by id
export const thunkGetFollow = (followId) => async (dispatch) => {
    const response = await fetch(`/api/follows/${followId}`);
    if (response.ok) {
        const follow = await response.json();
        dispatch(setFollow(follow));
        return follow;
    } else {
        // handle error
        return { error: "Failed to fetch follow" };
    }
}
// GET many follows (for example, for a user's follows)
export const thunkGetFollows = () => async (dispatch) => {
    const response = await fetch('/api/follows');
    if (response.ok) {
        const follows = await response.json();
        dispatch(setFollows(follows));
        return follows;
    } else {
        // handle error
        return { error: "Failed to fetch follows" };
    }
}
// POST a new follow (creating a new follow)
export const thunkCreateFollow = (followData) => async (dispatch) => {
    const response = await fetch('/api/follows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(followData)
    });
    if (response.ok) {
        const follow = await response.json();
        dispatch(setFollow(follow));
        return follow;
    } else {
        // handle error
        return { error: "Failed to create follow" };
    }
}
// DELETE a follow (removing a follow)
export const thunkDeleteFollow = (followId) => async (dispatch) => {
    const response = await fetch(`/api/follows/${followId}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        dispatch(removeFollow(followId));
        return followId;
    } else {
        // handle error
        return { error: "Failed to delete follow" };
    }
}
// PUT (update) a follow
export const thunkUpdateFollow = (followId, updates) => async (dispatch) => {
    const response = await fetch(`/api/follows/${followId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });

    if (response.ok) {
        const updatedFollow = await response.json();
        dispatch(setFollow(updatedFollow));
        return updatedFollow;
    } else {
        // handle error
        return { error: "Failed to update follow" };
    }
}

// initial state
const initialState = {
    byId: {}, // stores follows by their id
    allIds: [] // stores all follow ids
};

// reducer
export default function followsReducer(state = initialState, action) {
    switch (action.type) {
        case SET_FOLLOW: {
            const follow = action.payload;
            return {
                ...state,
                byId: { ...state.byId, [follow.id]: follow },
                allIds: state.allIds.includes(follow.id)
                    ? state.allIds
                    : [...state.allIds, follow.id]
            };
        }
        case SET_FOLLOWS: {
            const follows = action.payload;
            const newById = {};
            const newAllIds = [];
            follows.forEach(follow => {
                newById[follow.id] = follow;
                newAllIds.push(follow.id);
            });
            return {
                byId: newById,
                allIds: newAllIds
            };
        }
        case REMOVE_FOLLOW: {
            const followId = action.payload;
            const newById = { ...state.byId };
            delete newById[followId];
            return {
                byId: newById,
                allIds: state.allIds.filter(id => id !== followId)
            };

        }
        case CLEAR_FOLLOWS:
            return { ...initialState };
        default:
            return state;
    }
}