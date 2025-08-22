import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkCreateDesign } from "../../redux/designs";
import "./DesignEditor.css"
import { useNavigate } from "react-router-dom";



const SHIRT_SVG_PATH = "/assets/ShirtSVG.svg";

function DesignEditor() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    //const fileInputRef = useRef();
    const [designImage, setDesignImage] = useState(null); // Stores a dataURL for the uploaded image
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState([]);
    //const [designPos, setDesignPos] = useState({ x: 100, y: 120 });// state of poisition

    // Handle image upload, convert file to dataURL (base64)
    // function handleImageUpload(event) {
    //     const file = event.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = e => setDesignImage(e.target.result);
    //         reader.readAsDataURL(file);
    //     }
    // }
    function handleImageUpload(e) {
        setErrors([]);
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setErrors(["Please upload a valid image file."]);
            return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => {
            setDesignImage(ev.target.result);
            e.target.value = ""; // <-- important: allows same file to be re-selected
        };
        reader.onerror = () => setErrors(["File upload failed"]);
        e.target.value = "";
        reader.readAsDataURL(file);
    }

    // Generate SVG markup string including shirt outline and uploaded image
    function generateSVGMarkup({ shirtSVGPath, designImage }) {
        // These coordinates/size determine where the user's design appears on the shirt
        const shirtWidth = 400;
        const shirtHeight = 400;
        const imageWidth = 160;
        const imageHeight = 160;
        const imageX = 80;
        const imageY = 120;

        // Notice: <image href="..." /> will embed the SVG outline and the uploaded design.
        // "shirtSVGPath" is public (e.g. /assets/ShirtSVG.svg), browsers will load it.
        return `
<svg width="${shirtWidth}" height="${shirtHeight}" xmlns="http://www.w3.org/2000/svg">
  <image href="${shirtSVGPath}" x="0" y="0" width="${shirtWidth}" height="${shirtHeight}" />
  <image href="${designImage}" x="${imageX}" y="${imageY}" width="${imageWidth}" height="${imageHeight}" />
</svg>`;
    }

    // Handle form submission, generate SVG, POST to backend
    async function handleSubmit(e) {
        e.preventDefault();
        setErrors([]);
        if (!designImage || !title) {
            setErrors(["Title and image required"]);
            return;
        }

        // Build SVG markup
        const svgMarkup = generateSVGMarkup({
            shirtSVGPath: SHIRT_SVG_PATH,
            designImage,
        });

        // Send as svg_data to backend
        const result = await dispatch(thunkCreateDesign({
            title,
            svg_data: svgMarkup,
            description,
        }));

        // Optionally handle result UI/redirect
        if (result?.error) {
            setErrors([result.error]);
        } else if (result?.id) {
            navigate(`/designs/${result.id}`); // Redirect to detail page!
        } else {
            setErrors(["Something went wrong"]);
        }
    }

    return (
        <form className="design-editor" onSubmit={handleSubmit} style={{ maxWidth: 460, margin: "36px auto", padding: 24, background: "#fff", borderRadius: 8 }}>
            <h2>Post Your Shirt Design</h2>
            {/* Canvas (never overlaps input or form!) */}
            <div
                style={{
                    position: "relative",
                    width: 400,
                    height: 400,
                    border: "1px solid #ddd",
                    margin: "0 auto 32px auto",
                }}
            >
                <img
                    src={SHIRT_SVG_PATH}
                    alt="T-shirt"
                    style={{
                        width: 400,
                        height: 400,
                        display: "block",
                    }}
                />
                {designImage && (
                    <img
                        src={designImage}
                        alt="Design"
                        style={{
                            position: "absolute",
                            top: 120,
                            left: 80,
                            width: 160,
                            height: 160,
                            objectFit: "contain",
                            pointerEvents: "none",
                        }}
                    />
                )}
            </div>

            <label style={{ display: "block", marginBottom: "1.5em" }}>
                Upload your design (PNG/JPG)
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "block", margin: "0.5em 0 0 0" }}
                />
            </label>

            <label style={{ display: "block", marginBottom: "1em" }}>
                Title
                <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    style={{ width: "100%", marginTop: 6, padding: 8 }}
                />
            </label>

            <label style={{ display: "block", marginBottom: "1em" }}>
                Description
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={5}
                    style={{
                        width: "100%",
                        marginTop: "0.5em",
                        resize: "vertical",
                        minHeight: 80,
                        boxSizing: "border-box",
                        fontSize: 16
                    }}
                    placeholder="Enter your description here..."
                />
            </label>

            {errors.length > 0 && (
                <ul>
                    {errors.map((err, i) => (
                        <li key={i} style={{ color: "red" }}>
                            {err}
                        </li>
                    ))}
                </ul>
            )}

            <button
                type="submit"
                style={{
                    background: "#855cf8",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    fontSize: 18,
                    fontWeight: "bold",
                    padding: "10px 34px",
                    marginTop: 16,
                    cursor: "pointer",
                    display: "block"
                }}
            >
                Create Design
            </button>
        </form>
    );
}

export default DesignEditor;