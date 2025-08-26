import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetPost, thunkUpdatePost } from "../../redux/posts";
import { useParams, useNavigate } from "react-router-dom";

function EditPostPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const post = useSelector(state => state.posts.byId?.[id]);

    // Form state
    const [caption, setCaption] = useState("");
    const [error, setError] = useState(null);

    // On mount OR when post changes, update local state:
    useEffect(() => {
        if (!post) {
            dispatch(thunkGetPost(id));
        } else {
            setCaption(post.caption ?? "");  // update when post loaded
        }
    }, [dispatch, id, post]);

    if (!post) return <div>Loading post...</div>;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const res = await dispatch(thunkUpdatePost(id, { caption }));
        if (res && res.id) {
            navigate(`/posts`);
        } else if (res && res.error) {
            setError(res.error);
        } else {
            setError("Failed to update post");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Edit Your Post</h2>
            <label>
                Caption:
                <input
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                />
            </label>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <button type="submit">Save Changes</button>
            {/* Post design SVG preview */}
            <div
                style={{
                    border: "1px solid #ddd",
                    width: 400,
                    height: 400,
                    background: "#faf8f3",
                    margin: "0 auto",
                    marginBottom: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
                dangerouslySetInnerHTML={{ __html: post.svg_data }}
            />
            <label>
                Caption:
                <input value={caption} onChange={e => setCaption(e.target.value)} />
            </label>

        </form>
    );
}

export default EditPostPage;