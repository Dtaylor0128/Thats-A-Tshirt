// follow action types
const LOAD_FOLLOWS = 'follows/LOAD_FOLLOWS';          // fetch multiple follows
const UPLOAD_FOLLOW = 'follows/UPLOAD_FOLLOW';        // fetch/create/replace a single follow
const CREATE_FOLLOW = 'follows/CREATE_FOLLOW';        // create a single follow (used after POST)
const UPDATE_FOLLOW = 'follows/UPDATE_FOLLOW';        // update a single follow (used after PUT/PATCH)
const DELETE_FOLLOW = 'follows/DELETE_FOLLOW';        // delete by id
const LOAD_FOLLOWERS = 'follows/LOAD_FOLLOWERS';
const LOAD_FOLLOWING = 'folows/LOAD_FOLLOWING';

// action creators
export const loadFollows = (follows) => ({
    type: LOAD_FOLLOWS,
    follows
});
export const uploadFollow = (follow) => ({
    type: UPLOAD_FOLLOW,
    follow
});
export const createFollow = (follow) => ({
    type: CREATE_FOLLOW,
    follow
});
export const updateFollow = (follow) => ({
    type: UPDATE_FOLLOW,
    follow
});
export const deleteFollow = (followId) => ({
    type: DELETE_FOLLOW,
    followId
});
export const loadFollowers = (followers) => ({
    type: LOAD_FOLLOWERS,
    followers
});

export const loadFollowing = (following) => ({
    type: LOAD_FOLLOWING,
    following
});


// Thunks
export const thunkGetFollowers = (userId) => async dispatch => {
    const response = await fetch(`/api/users/${userId}/followers`);
    if (response.ok) {
        const data = await response.json();
        dispatch(loadFollowers(data.followers));
        return data.followers;
    } else {
        // handle error as needed
        return [];
    }
};

export const thunkGetFollowing = (userId) => async dispatch => {
    const response = await fetch(`/api/users/${userId}/following`);
    if (response.ok) {
        const data = await response.json();
        dispatch(loadFollowing(data.following));
        return data.following;
    } else {
        // handle error as needed
        return [];
    }
};
// GET one follow by id
export const thunkGetFollow = (id) => async dispatch => {
    const response = await fetch(`/api/follows/${id}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(uploadFollow(data.follow));  // uses UPLOAD_FOLLOW for single fetch
        return data.follow;
    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages;
    } else {
        return { server: "Something went wrong. Please try again" };
    }
};

// GET many follows (for example, for a user's follows)
export const thunkGetFollows = () => async dispatch => {
    const response = await fetch('/api/follows');
    if (response.ok) {
        const data = await response.json();
        const followsArray = Array.isArray(data) ? data : data.follows;
        dispatch(loadFollows(followsArray));
        return followsArray;
    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages;
    } else {
        return { server: "Something went wrong. Please try again" };
    }
};


// POST a new follow (creating a new follow)
export const thunkCreateFollow = (followData) => async dispatch => {
    const response = await fetch('/api/follows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(followData),
        credentials: 'include'
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(createFollow(data.follow));
        return data.follow;
    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages;
    } else {
        return { server: "Something went wrong. Please try again" };
    }
};
// DELETE a follow (removing a follow)
export const thunkDeleteFollow = (id) => async dispatch => {
    const response = await fetch(`/api/follows/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (response.ok) {
        dispatch(deleteFollow(id));
        return id;
    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages;
    } else {
        return { server: "Something went wrong. Please try again" };
    }
};


// PUT (update) a follow
export const thunkUpdateFollow = (id, updates) => async dispatch => {
    const response = await fetch(`/api/follows/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
        credentials: 'include'
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(updateFollow(data.follow));
        return data.follow;
    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages;
    } else {
        return { server: "Something went wrong. Please try again" };
    }
};

// initial state
const initialState = {
    byId: {}, // stores follows by their id
    allIds: [] // stores all follow ids
};

// reducer
export default function followsReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_FOLLOWS: {
            const newById = {};
            const newAllIds = [];
            action.follows.forEach(follow => {
                newById[follow.id] = follow;
                newAllIds.push(follow.id);
            });
            return { ...state, byId: newById, allIds: newAllIds };
        }
        case UPLOAD_FOLLOW:
        case CREATE_FOLLOW:
        case UPDATE_FOLLOW: {
            const follow = action.follow;
            return {
                ...state,
                byId: { ...state.byId, [follow.id]: follow },
                allIds: state.allIds.includes(follow.id)
                    ? state.allIds
                    : [...state.allIds, follow.id]
            };
        }
        case DELETE_FOLLOW: {
            const { followId } = action;
            // eslint-disable-next-line no-unused-vars
            const { [followId]: _, ...newById } = state.byId;
            return {
                ...state,
                byId: newById,
                allIds: state.allIds.filter(id => id !== followId)
            };
        }
        case LOAD_FOLLOWERS:
            return { ...state, followers: action.followers };
        case LOAD_FOLLOWING:
            return { ...state, following: action.following };
        default:
            return state;
    }
}