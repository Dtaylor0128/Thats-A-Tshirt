// redux  for managing all loaded user data

//Actions Types
const SET_USER = 'users/setUser';
const SET_USERS = 'users/setUsers';
const REMOVE_USER = 'users/removeUser';
const CLEAR_USER = 'users/clearUser';

//Action Creators
const setUser = (user) => ({
    type: SET_USER,
    payload: user
});

const setUsers = (users) => ({
    type: SET_USERS,
    payload: users // array of users
});

const removeUser = () => ({
    type: REMOVE_USER,
    payload: userId // userId to remove
});

const clearUser = () => ({
    type: CLEAR_USER
});


//Thunks

// GET one user by id( for profile page, for example)
export const thunkGetUser = (userId) => async (dispatch) => {
    const response = await fetch(`/api/users/${userId}`);
    if (response.ok) {
        const user = await response.json();
        dispatch(setUser(user));
        return user;
    } else {
        // handle error
        return { error: "Failed to fetch user" };
    }
}

// GET many users (for example, for a user list, folloers list, etc.)
export const thunkGetUsers = () => async (dispatch) => {
    const response = await fetch('/api/users');
    if (response.ok) {
        const users = await response.json();
        dispatch(setUsers(users));
        return users;
    } else {
        // handle error
        return { error: "Failed to fetch users" };
    }
}

// Update a user ( editing profile page, admin actions, etc.)
export const thunkUpdateUser = (userId, updates) => async (dispatch) => {
    const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });

    if (response.ok) {
        const user = await response.json();
        dispatch(setUser(user));
        return user;
    } else {
        // handle error
        const errorData = await response.json();
        return errorData
    }
}
/* Designed to take in userId and updates parameters { username: 'newName', bio: 'something' },
then Send a put request to /api/users/${userId} returning the values to update. if response true dispatch 
setUser(user) action to update redux, return user or error*/

// Delete a user (for admin actions, etc.)
export const thunkDeleteUser = (userId) => async (dispatch) => {
    const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        dispatch(removeUser(userId));
        return true; // return true on success    
    } else {
        // handle error
        return false; // return false on failure

    }
}

// Initial state 
const initialState = {
    byId: {},
    allIds: []
};

// Reducer
export default function usersReducer(state = initialState, action) {
    switch (action.type) {
        case SET_USER: {
            const user = action.payload;
            return {
                byId: { ...state.byId, [user.id]: user },
                allIds: state.allIds.includes(user.id)
                    ? state.allIds
                    : [...state.allIds, user.id]
            };
        }
        case SET_USERS: {
            const users = action.payload;
            const byId = {};
            const allIds = [];
            users.forEach(user => {
                byId[user.id] = user;
                allIds.push(user.id);
            });
            return { byId, allIds };
        }
        case REMOVE_USER: {
            const userId = action.payload;
            const newById = { ...state.byId };
            delete newById[userId];
            return {
                byId: newById,
                allIds: state.allIds.filter(id => id !== userId)
            };
        }
        case CLEAR_USERS:
            return { ...initialState };
        default:
            return state;
    }
}

// notes
// - The thunkGetUser and thunkGetUsers functions fetch user data from the API and dispatch actions to update the Redux state.
// - The thunkUpdateUser function sends a PUT request to update user data and dispatches the setUser action to update the state with the new user data.
// - The thunkDeleteUser function sends a DELETE request to remove a user and dispatches the removeUser action to update the state.
// - The reducer handles the actions to update the state based on the dispatched actions.
// - byId and allIds implement normalized Redux state for fast lookup and easy CRUD.
// - Thunks cover fetch one/many, update, and delete.
// - Error returns match existing convention.
// - Selectors can be added as needed (selectUserById, selectAllUsers, etc.) depending on your component queries.
// - Integrating, this reducer into  combineReducers root, and use the same pattern for designs, posts, etc..