

// action types for design  management
const SET_DESIGN = 'designs/setDesign';
const SET_DESIGNS = 'designs/setDesigns';
const REMOVE_DESIGN = 'designs/removeDesign';
const CLEAR_DESIGNS = 'designs/clearDesigns';

// action creators
export const setDesign = (design) => ({
    type: SET_DESIGN,
    payload: design
});

export const setDesigns = (designs) => ({
    type: SET_DESIGNS,
    designs // array of designs
});

export const removeDesign = (designId) => ({
    type: REMOVE_DESIGN,
    payload: designId
});

export const clearDesigns = () => ({
    type: CLEAR_DESIGNS
});



// Thunks

// GET one design by id 
export const thunkGetDesign = (designId) => async (dispatch) => {
    const response = await fetch(`/api/designs/${designId}`);
    if (response.ok) {
        const json = await response.json();
        //flask wraps the design in a data object
        const design = json.design;
        dispatch(setDesign(design));
        return design;
    } else {
        // handle error
        return { error: "Failed to fetch design" };
    }
};
// will extract the design from the response and work with reducer


// GET many designs (for example, for a user's design list)
export const thunkGetDesigns = () => async (dispatch) => {
    const response = await fetch('/api/designs');
    if (response.ok) {
        const data = await response.json();
        // if data is {design:[]}, we only want the array

        dispatch(setDesigns(data.designs));
    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages
    } else {
        return { server: "Something went wrong. Please try again" }
    }
};


// POST a new design (creating a new design)
export const thunkCreateDesign = (data) => async (dispatch) => {
    const response = await fetch("/api/designs/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
    });
    if (response.ok) {
        const newDesign = await response.json();
        dispatch(setDesign(newDesign));
        return newDesign; // <<< CRUCIAL: return the new design!

    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages
    } else {

        return { server: "Something went wrong, Please try again." };
    }
};


// PUT to update a design (editing an existing design)
export const thunkUpdateDesign = (designId, updates) => async (dispatch) => {
    const response = await fetch(`/api/designs/${designId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
        credentials: "include",

    });

    if (response.ok) {
        const design = await response.json();
        dispatch(setDesign(design));
        return design;
    } else {
        // handle error
        const errorData = await response.json();
        return errorData;
    }
}

// DELETE a design (removing a design)
export const thunkDeleteDesign = (designId) => async (dispatch) => {
    const response = await fetch(`/api/designs/${designId}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        dispatch(removeDesign(designId));
        return true;
    } else {
        // handle error
        return false;
    }
}

const initialState = {};

// Reducer
export default function designsReducer(state = initialState, action) {
    switch (action.type) {
        case SET_DESIGN: {
            const design = action.payload;
            return {
                byId: { ...state.byId, [design.id]: design },
                allIds: state.allIds.includes(design.id)
                    ? state.allIds
                    : [...state.allIds, design.id]
            };
        }
        // case SET_DESIGNS: {
        //     const designs = action.payload;
        //     const byId = {};
        //     const allIds = [];
        //     designs.forEach(design => {
        //         byId[design.id] = design;
        //         allIds.push(design.id);
        //     });
        //     return { byId, allIds };
        // }
        case SET_DESIGNS: {

            const newState = { ...state, Designs: action.designs };
            return newState;

        }
        case REMOVE_DESIGN: {
            const designId = action.payload;
            const newById = { ...state.byId };
            delete newById[designId];
            return {
                byId: newById,
                allIds: state.allIds.filter(id => id !== designId)
            };
        }
        case CLEAR_DESIGNS:
            return { ...initialState };
        default:
            return state;
    }
}

// Notes:
// - This reducer manages designs by storing them in a normalized format.
// - It allows for easy access to individual designs by their ID and maintains a list of all design IDs for iteration.
// - The thunks handle API interactions for creating, reading, updating, and deleting designs, dispatching the appropriate actions to update the state in the Redux store.