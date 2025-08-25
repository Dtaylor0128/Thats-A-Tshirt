// createpost page

import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { thunkCreatePost } from "../../redux/posts";

function CreatePostPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { designId, svg_data, title } = location.state || {};
    const [caption, setCaption] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        console.log("Post to Feed button clicked")
        console.log("Submitting post:", { designId, svg_data, title, caption });
        // Dispatch thunk/post API with the design info and caption
        const res = await dispatch(
            thunkCreatePost({
                designId,
                svg_data,
                caption,
                title,
            })
        );
        // Adjust this logic if your thunk returns a different shape
        console.log("Thunk result:", res);
        if (!res?.error) {
            navigate("/posts"); // <--- Go to your feed page
        } else {
            setError(res.error || "Failed to post. Try again!");
        }
    };

    if (!svg_data) return <div>No design loaded!</div>;

    return (
        <div style={{ maxWidth: 540, margin: "0 auto", padding: 28 }}>
            <h2>Post Your Shirt Design</h2>
            {title && <h3 style={{ textAlign: "center", marginBottom: 12 }}>{title}</h3>}
            <div
                style={{
                    border: "1px solid #ddd",
                    width: 400,
                    height: 400,
                    background: "#faf8f3",
                    margin: "0 auto"
                }}
                dangerouslySetInnerHTML={{ __html: svg_data }}
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
// function CreatePostPage() {
//     const location = useLocation();
//     // svg_data: full SVG string including both shirt and user design
//     const { designId, svg_data, title } = location.state || {};
//     const canvasRef = useRef(null);
//     const [imageUrl, setImageUrl] = useState(null);
//     const [caption, setCaption] = useState("");

//     // Convert SVG to PNG image for preview/thumbnails
//     useEffect(() => {
//         if (!svg_data) return;
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext("2d");
//         const img = new window.Image();
//         const svgBlob = new Blob([svg_data], { type: "image/svg+xml;charset=utf-8" });
//         const url = URL.createObjectURL(svgBlob);

//         img.onload = function () {
//             // Use fixed canvas size (matches SVG dimensions)
//             const width = img.width || 400;
//             const height = img.height || 400;
//             canvas.width = width;
//             canvas.height = height;
//             ctx.clearRect(0, 0, width, height);
//             ctx.drawImage(img, 0, 0, width, height);
//             setImageUrl(canvas.toDataURL("image/png"));
//             URL.revokeObjectURL(url);
//         };
//         img.src = url;
//     }, [svg_data]);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         // Post to feed: imageUrl is PNG preview of full shirt+design, caption as user input
//         alert("This would post your shirt image and caption to the feed!");
//         // Example: dispatch(thunkCreatePost({ designId, caption, image: imageUrl }));
//     };

//     if (!svg_data) return <div>No design loaded! Please go back and pick a shirt design.</div>;

//     return (
//         <div style={{ maxWidth: 540, margin: "0 auto", padding: 28 }}>
//             <h2>Post Your Shirt Design</h2>
//             {title && <h3 style={{ textAlign: "center", marginBottom: 12 }}>{title}</h3>}
//             <div style={{ textAlign: "center" }}>
//                 <canvas ref={canvasRef} style={{ display: "none" }} />
//                 {imageUrl && (
//                     <img
//                         src={imageUrl}
//                         alt="T-shirt design preview"
//                         style={{
//                             width: 340,
//                             height: 340,
//                             border: "1px solid #ddd",
//                             margin: "0 auto",
//                             display: "block",
//                             background: "#fff" // just in case
//                         }}
//                     />
//                 )}
//                 <div style={{ fontSize: 14, marginTop: 6 }}>Preview (Shirt + Design as PNG)</div>
//             </div>
//             {/* Caption input */}
//             <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
//                 <label style={{ display: "block", marginBottom: 16 }}>
//                     Caption:
//                     <input
//                         type="text"
//                         value={caption}
//                         onChange={e => setCaption(e.target.value)}
//                         placeholder="Write a caption for your shirt"
//                         style={{ width: "100%", padding: 10, marginTop: 8 }}
//                     />
//                 </label>
//                 <button
//                     type="submit"
//                     disabled={!imageUrl || !caption}
//                     style={{
//                         background: "#6c47f8",
//                         color: "#fff",
//                         border: "none",
//                         fontSize: 16,
//                         padding: "10px 30px",
//                         borderRadius: 5,
//                         cursor: "pointer",
//                         fontWeight: 600
//                     }}
//                 >
//                     Post to Feed
//                 </button>
//             </form>
//         </div>
//     );
// }

//export default CreatePostPage;

// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { thunkCreatePost } from "../../redux/posts"; // adjust path
// import { useNavigate } from "react-router-dom";

// function CreatePostPage() {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const [title, setTitle] = useState("");
//     const [description, setDescription] = useState("");
//     const [errors, setErrors] = useState([]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const newPost = { title, description };
//         const result = await dispatch(thunkCreatePost(newPost));
//         if (result && result.id) {
//             navigate(`/posts/${result.id}`);
//         } else if (result && result.error) {
//             setErrors([result.error]);
//         } else {
//             setErrors(["Something went wrong."]);
//         }
//     };

//     return (
//         <div className="create-post-page">
//             <h2>Create New Post</h2>
//             <form onSubmit={handleSubmit}>
//                 <label>
//                     Title
//                     <input value={title} onChange={e => setTitle(e.target.value)} required />
//                 </label>
//                 <label>
//                     Description
//                     <textarea value={description} onChange={e => setDescription(e.target.value)} />
//                 </label>
//                 {errors.length > 0 && (
//                     <ul>
//                         {errors.map((err, i) => <li key={i} style={{ color: "red" }}>{err}</li>)}
//                     </ul>
//                 )}
//                 <button type="submit">Create Post</button>
//             </form>
//         </div>
//     );
// }

// export default CreatePostPage;