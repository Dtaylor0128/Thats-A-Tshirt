import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetPost, thunkUpdatePost } from "../../redux/posts";
import { useParams, useNavigate } from "react-router-dom";

function EditPostPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const post = useSelector(state => state.posts.byId?.[id]);
    const currentUser = useSelector(state => state.session.user);

    // Form state
    const [caption, setCaption] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Load post and set form data
    useEffect(() => {
        if (!post) {
            dispatch(thunkGetPost(id));
        } else {
            setCaption(post.caption || "");
        }
    }, [dispatch, id, post]);

    // Check ownership
    if (post && currentUser && post.user_id !== currentUser.id) {
        return <div>You can only edit your own posts.</div>;
    }

    if (!post) return <div>Loading post...</div>;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const result = await dispatch(thunkUpdatePost(id, { caption }));

        if (result && !result.error) {
            navigate(`/posts`);
        } else {
            setError(result?.error || "Failed to update post");
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: 540, margin: "0 auto", padding: 28 }}>
            <h2>Edit Post</h2>
            <div
                dangerouslySetInnerHTML={{ __html: post.svg_data }}
                style={{
                    border: "1px solid #ddd",
                    width: 300,
                    height: 300,
                    background: "#faf8f3",
                    margin: "0 auto 20px"
                }}
            />
            <h3>{post.title}</h3>

            <form onSubmit={handleSubmit}>
                <label style={{ display: "block", marginBottom: 16 }}>
                    Caption:
                    <input
                        type="text"
                        value={caption}
                        onChange={e => setCaption(e.target.value)}
                        style={{ width: "100%", padding: 10, marginTop: 8 }}
                    />
                </label>

                {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        background: "#6c47f8",
                        color: "#fff",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: 5,
                        cursor: loading ? "not-allowed" : "pointer",
                        marginRight: 10
                    }}
                >
                    {loading ? "Updating..." : "Update Post"}
                </button>

                <button
                    type="button"
                    onClick={() => navigate(`/posts/${id}`)}
                    style={{
                        background: "#ccc",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: 5,
                        cursor: "pointer"
                    }}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default EditPostPage;

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { thunkGetPost, thunkUpdatePost } from "../../redux/posts";
// import { useParams, useNavigate } from "react-router-dom";

// function EditPostPage() {
//     const { id } = useParams();
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const post = useSelector(state => state.posts.byId?.[id]);

//     // Form state
//     const [caption, setCaption] = useState("");
//     const [error, setError] = useState(null);

//     // On mount OR when post changes, update local state:
//     useEffect(() => {
//         if (!post) {
//             dispatch(thunkGetPost(id));
//         } else {
//             setCaption(post.caption ?? "");  // update when post loaded
//         }
//     }, [dispatch, id, post]);

//     if (!post) return <div>Loading post...</div>;

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(null);
//         const res = await dispatch(thunkUpdatePost(id, { caption }));
//         if (res && res.id) {
//             navigate(`/posts`);
//         } else if (res && res.error) {
//             setError(res.error);
//         } else {
//             setError("Failed to update post");
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <h2>Edit Your Post</h2>
//             <label>
//                 Caption:
//                 <input
//                     value={caption}
//                     onChange={e => setCaption(e.target.value)}
//                 />
//             </label>
//             {error && <div style={{ color: "red" }}>{error}</div>}
//             <button type="submit">Save Changes</button>
//             {/* Post design SVG preview */}
//             <div
//                 style={{
//                     border: "1px solid #ddd",
//                     width: 400,
//                     height: 400,
//                     background: "#faf8f3",
//                     margin: "0 auto",
//                     marginBottom: 12,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center"
//                 }}
//                 dangerouslySetInnerHTML={{ __html: post.svg_data }}
//             />
//             <label>
//                 Caption:
//                 <input value={caption} onChange={e => setCaption(e.target.value)} />
//             </label>

//         </form>
//     );
// }

// export default EditPostPage;