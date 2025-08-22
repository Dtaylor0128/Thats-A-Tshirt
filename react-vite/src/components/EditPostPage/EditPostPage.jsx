import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetPost, thunkUpdatePost } from "../../redux/posts";
import { useParams, useNavigate } from "react-router-dom";

function EditPostPage() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const navigate = useNavigate();
    const post = useSelector(state => state.posts?.byID?.[id]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        dispatch(thunkGetPost(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (post) {
            setTitle(post.title || "");
            setDescription(post.description || "");
        }
    }, [post]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updates = { title, description };
        const result = await dispatch(thunkUpdatePost(id, updates));
        if (result && !result.error) {
            navigate(`/posts/${id}`);
        } else {
            setErrors([result.error || "Failed to update post"]);
        }
    };

    if (!post) return <div>Loading post...</div>;

    return (
        <div>
            <h2>Edit Post</h2>
            <form onSubmit={handleSubmit}>
                <label>Title
                    <input value={title} onChange={e => setTitle(e.target.value)} required />
                </label>
                <label>Description
                    <textarea value={description} onChange={e => setDescription(e.target.value)} />
                </label>
                {errors.length > 0 && <ul>{errors.map((err, i) => <li key={i} style={{ color: 'red' }}>{err}</li>)}</ul>}
                <button type="submit">Update Post</button>
            </form>
        </div>
    );
}
export default EditPostPage;