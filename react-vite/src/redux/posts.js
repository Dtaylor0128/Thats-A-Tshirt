// action types for post management
const LOAD_POSTS = 'posts/LOAD_POSTS';          // fetch multiple posts
const UPLOAD_POST = 'posts/UPLOAD_POST';        // fetch/create/replace a single post
const CREATE_POST = 'posts/CREATE_POST';        // create a single post (used after POST)
const UPDATE_POST = 'posts/UPDATE_POST';        // update a single post (used after PUT/PATCH)
const DELETE_POST = 'posts/DELETE_POST';        // delete by id

// --- Action Creators ---
export const loadPosts = (posts) => ({
    type: LOAD_POSTS,
    posts
});
export const uploadPost = (post) => ({
    type: UPLOAD_POST,
    post
});
export const createPost = (post) => ({
    type: CREATE_POST,
    post
});
export const updatePost = (post) => ({
    type: UPDATE_POST,
    post
});
export const deletePost = (postId) => ({
    type: DELETE_POST,
    postId
});

// Thunks
// GET one post by id
export const thunkGetPost = (id) => async dispatch => {
    const response = await fetch(`/api/posts/${id}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(uploadPost(data));  // uses UPLOAD_POST for single fetch
        return data;
    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages;
    } else {
        return { server: "Something went wrong. Please try again" };
    }
};

// GET many posts (for example, for a user's feed)
export const thunkGetPosts = () => async dispatch => {
    const response = await fetch('/api/posts');
    if (response.ok) {
        const data = await response.json();
        const postsArray = Array.isArray(data) ? data : data.posts;
        dispatch(loadPosts(postsArray));
        return postsArray;
    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages;
    } else {
        return { server: "Something went wrong. Please try again" };
    }
};

// POST a new post (creating a new post)
export const thunkCreatePost = (postData) => async dispatch => {
    const response = await fetch('/api/posts/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
        credentials: 'include',  // <credentials
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(createPost(data));
        return data;
    } else {
        // handle errors
        try {
            const err = await response.json();
            return { error: err.message || "Failed to create post" };
        } catch {
            return { error: "Failed to create post" };
        }
    }
};

// PUT to update an existing post
export const thunkUpdatePost = (id, updates) => async dispatch => {
    const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
        credentials: 'include'
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(updatePost(data.post));
        return data.post;
    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages;
    } else {
        return { server: "Something went wrong. Please try again" };
    }
};

// DELETE a post
export const thunkDeletePost = (id) => async dispatch => {
    const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (response.ok) {
        dispatch(deletePost(id));
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
    byId: {},
    allIds: []
};

//reducer 
export default function postsReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_POSTS: {
            const newById = { ...state.byId }; // merge with existing
            action.posts.forEach(post => { newById[post.id] = post; });
            return {
                ...state,
                byId: newById,
                allIds: [...new Set([...state.allIds, ...action.posts.map(p => p.id)])]
            };
        }
        case UPLOAD_POST: {
            const post = action.post;
            return {
                ...state,
                byId: { ...state.byId, [post.id]: post },
                allIds: state.allIds.includes(post.id) ? state.allIds : [...state.allIds, post.id]
            };
        }
        case CREATE_POST:
        case UPDATE_POST: {
            const post = action.post;
            return {
                ...state,
                byId: { ...state.byId, [post.id]: post },
                allIds: state.allIds.includes(post.id)
                    ? state.allIds
                    : [...state.allIds, post.id]
            };
        }
        case DELETE_POST: {
            const { postId } = action;
            // eslint-disable-next-line no-unused-vars
            const { [postId]: _removed, ...newById } = state.byId;
            return {
                ...state,
                byId: newById,
                allIds: state.allIds.filter(id => id !== postId)
            };
        }
        default:
            return state;
    }
}

// notes
