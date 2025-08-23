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
export const thunkGetPost = (postId) => async (dispatch) => {
    const response = await fetch(`/api/posts/${postId}`);
    if (response.ok) {
        const post = await response.json();
        dispatch(setPost(post));
        return post;
    } else {
        // handle error
        return { error: "Failed to fetch post", status: response.status };
    }
};

// GET many posts (for example, for a user's feed)
export const thunkGetPosts = () => async (dispatch) => {
    const response = await fetch('/api/posts');
    if (response.ok) {
        const data = await response.json();
        // Make sure we're dispatching an array, not an object!
        const postsArray = Array.isArray(data) ? data : data.posts;
        dispatch(setPosts(postsArray));
        return postsArray;
    } else {
        return { error: "Failed to fetch posts" };
    }
}

// POST a new post (creating a new post)
export const thunkCreatePost = (postData) => async (dispatch) => {
    const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
        credentials: "include",

    });

    if (response.ok) {
        const newPost = await response.json();
        dispatch(setPost(newPost));
        return newPost;
    } else {
        // handle error
        return { error: "Failed to create post" };
    }
}

// PUT to update an existing post
export const thunkUpdatePost = (postId, updates) => async (dispatch) => {
    const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
        credentials: "include",
    });

    if (response.ok) {
        const updatedPost = await response.json();
        dispatch(setPost(updatedPost));
        return updatedPost;
    } else {
        // handle error
        return { error: "Failed to update post" };
    }
}

// DELETE a post
export const thunkDeletePost = (postId) => async (dispatch) => {
    const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        dispatch(removePost(postId));
        return postId;
    } else {
        // handle error
        return { error: "Failed to delete post" };
    }
}


// Initial state
const initialState = {
    byID: {},
    allIDs: []
};

//reducer 
export default function postsReducer(state = initialState, action) {
    switch (action.type) {
        case SET_POST: {
            const { id } = action.payload;
            return {
                ...state,
                byID: {
                    ...state.byID,
                    [id]: action.payload
                },
                allIDs: state.allIDs.includes(id)
                    ? state.allIDs
                    : [...state.allIDs, id]
            };
        }
        case SET_POSTS: {
            const incomingPosts = action.payload;
            const newById = { ...state.byID };
            const idsToAdd = [];

            incomingPosts.forEach(post => {
                newById[post.id] = post;
                if (!state.allIDs.includes(post.id)) {
                    idsToAdd.push(post.id);
                }
            });

            return {
                ...state,
                byID: newById,
                allIDs: [...state.allIDs, ...idsToAdd]
            };
        }
        case REMOVE_POST: {
            // eslint-disable-next-line no-unused-vars
            const { [action.payload]: _, ...restById } = state.byID;
            return {
                ...state,
                byID: restById,
                allIDs: state.allIDs.filter(id => id !== action.payload)
            };
        }
        case CLEAR_POSTS:
            return initialState;
        default:
            return state;
    }
}

// notes
// This file manages the state for posts in the application.
// It includes actions for creating, reading, updating, and deleting posts,
// as well as a reducer to handle the state changes. All actions now keep byID and allIDs in sync for partial and full fetches.
// The thunks handle the asynchronous API calls and dispatch the appropriate actions based on the responses.