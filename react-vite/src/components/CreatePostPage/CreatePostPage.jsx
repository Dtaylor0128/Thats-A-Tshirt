import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { thunkCreatePost } from "../../redux/posts";

function CreatePostPage() {
    const [searchParams] = useSearchParams();
    const designId = searchParams.get("designId");
    const design = useSelector(state => state.designs.byId[designId]);
    const user = useSelector(state => state.session.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [caption, setCaption] = useState("");
    const [error, setError] = useState(null);


    if (!user) return <div>Please log in to create a post.</div>;
    if (!designId || !design) return <div>No design selected!</div>;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const res = await dispatch(thunkCreatePost({
            design_id: Number(designId),
            svg_data: design.svg_data,
            caption,
            title: design.title,
        }));

        if (res && res.post) {
            navigate(`/posts`);
        } else if (res && res.error) {
            setError(res.error);
        } else {
            setError("Failed to create post. Make sure you are logged in.");
        }
    };


    return (
        <div style={{ maxWidth: 540, margin: "0 auto", padding: 28 }}>
            <h2>Post Your Shirt Design</h2>
            <h3 style={{ textAlign: "center", marginBottom: 12 }}>{design.title}</h3>
            <div
                style={{
                    border: "1px solid #ddd",
                    width: 400,
                    height: 400,
                    background: "#faf8f3",
                    margin: "0 auto"
                }}
                dangerouslySetInnerHTML={{ __html: design.svg_data }}
            />
            <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
                <label style={{ display: "block", marginBottom: 16 }}>
                    Caption:
                    <input
                        type="text"
                        value={caption}
                        onChange={e => setCaption(e.target.value)}
                        placeholder="Write a caption for your shirt"
                        style={{ width: "100%", padding: 10, marginTop: 8 }}
                    />
                </label>
                {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
                <button
                    type="submit"
                    style={{
                        background: "#6c47f8",
                        color: "#fff",
                        border: "none",
                        fontSize: 16,
                        padding: "10px 30px",
                        borderRadius: 5,
                        cursor: "pointer",
                        fontWeight: 600
                    }}
                >
                    Post to Feed
                </button>
            </form>
        </div>
    );
}

export default CreatePostPage;