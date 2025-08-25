

// action types for design  management
const LOAD_DESIGNS = 'designs/LOAD_DESIGNS';          // fetch multiple designs
const UPLOAD_DESIGN = 'designs/UPLOAD_DESIGN';        // fetch/create/replace a single design
const CREATE_DESIGN = 'designs/CREATE_DESIGN';        // create a single design (used after POST)
const UPDATE_DESIGN = 'designs/UPDATE_DESIGN';        // update a single design (used after PUT/PATCH)
const DELETE_DESIGN = 'designs/DELETE_DESIGN';        // delete by id

// action creators
export const loadDesigns = (designs) => ({
    type: LOAD_DESIGNS,
    designs
});

export const uploadDesign = (design) => ({
    type: UPLOAD_DESIGN,
    design
});

export const createDesign = (design) => ({
    type: CREATE_DESIGN,
    design
});

export const updateDesign = (design) => ({
    type: UPDATE_DESIGN,
    design
});

export const deleteDesign = (designId) => ({
    type: DELETE_DESIGN,
    designId
});



// Thunks

// GET one design by id 
export const thunkGetDesign = (id) => async dispatch => {
    const response = await fetch(`/api/designs/${id}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(uploadDesign(data.design));  // uses UPLOAD_DESIGN for single fetch
        return data.design;
    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages;
    } else {
        return { server: "Something went wrong. Please try again" };
    }
};

// GET many designs (for example, for a user's design list)
export const thunkGetDesigns = () => async dispatch => {
    const response = await fetch('/api/designs');
    if (response.ok) {
        const data = await response.json();
        dispatch(loadDesigns(data.designs));
        return data.designs;
    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages;
    } else {
        return { server: "Something went wrong. Please try again" };
    }
};


// POST a new design (creating a new design)
export const thunkCreateDesign = (designData) => async dispatch => {
    const response = await fetch('/api/designs/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(designData),
        credentials: 'include'
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(createDesign(data.design));
        return data.design;
    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages;
    } else {
        return { server: "Something went wrong. Please try again" };
    }
};


// PUT to update a design (editing an existing design)
export const thunkUpdateDesign = (id, updates) => async dispatch => {
    const response = await fetch(`/api/designs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
        credentials: 'include'
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(updateDesign(data.design));
        return data.design;
    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages;
    } else {
        return { server: "Something went wrong. Please try again" };
    }
};

// DELETE a design (removing a design)
export const thunkDeleteDesign = (id) => async dispatch => {
    const response = await fetch(`/api/designs/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (response.ok) {
        dispatch(deleteDesign(id));
        return id;
    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages;
    } else {
        return { server: "Something went wrong. Please try again" };
    }
};

// initial state 

const initialState = {
    byId: {},
    allIds: []
};

// Reducer
export default function designsReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_DESIGNS: {
            const newById = {};
            const newAllIds = [];
            action.designs.forEach(design => {
                newById[design.id] = design;
                newAllIds.push(design.id);
            });
            return { ...state, byId: newById, allIds: newAllIds };
        }

        case UPLOAD_DESIGN:
        case CREATE_DESIGN:
        case UPDATE_DESIGN: {
            const design = action.design;
            return {
                ...state,
                byId: { ...state.byId, [design.id]: design },
                allIds: state.allIds.includes(design.id)
                    ? state.allIds
                    : [...state.allIds, design.id]
            };
        }
        case DELETE_DESIGN: {
            const { designId } = action;
            const { [designId]: _, ...newById } = state.byId;
            return {
                ...state,
                byId: newById,
                allIds: state.allIds.filter(id => id !== designId)
            };
        }
        default:
            return state;
    }
}

// Notes:
