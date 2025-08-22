// createpost page

import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkCreatePost } from "../../redux/posts"; // adjust path
import { useNavigate } from "react-router-dom";

function CreatePostPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newPost = { title, description };
        const result = await dispatch(thunkCreatePost(newPost));
        if (result && result.id) {
            navigate(`/posts/${result.id}`);
        } else if (result && result.error) {
            setErrors([result.error]);
        } else {
            setErrors(["Something went wrong."]);
        }
    };

    return (
        <div className="create-post-page">
            <h2>Create New Post</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Title
                    <input value={title} onChange={e => setTitle(e.target.value)} required />
                </label>
                <label>
                    Description
                    <textarea value={description} onChange={e => setDescription(e.target.value)} />
                </label>
                {errors.length > 0 && (
                    <ul>
                        {errors.map((err, i) => <li key={i} style={{ color: "red" }}>{err}</li>)}
                    </ul>
                )}
                <button type="submit">Create Post</button>
            </form>
        </div>
    );
}

export default CreatePostPage;