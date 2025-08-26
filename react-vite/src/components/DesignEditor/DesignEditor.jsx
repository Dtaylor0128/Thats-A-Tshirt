import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { thunkCreateDesign } from "../../redux/designs";
import "./DesignEditor.css"
import { useNavigate } from "react-router-dom";

const SHIRT_SVG_PATH = "/assets/ShirtSVG.svg";

// Image processing constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
const MAX_IMAGE_DIMENSION = 1200; // Max width/height in pixels
const COMPRESSION_QUALITY = 0.8; // JPEG compression quality

function DesignEditor() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [designImage, setDesignImage] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // Image compression utility function
    const compressImage = (file, maxWidth = MAX_IMAGE_DIMENSION, quality = COMPRESSION_QUALITY) => {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // Calculate new dimensions while maintaining aspect ratio
                let { width, height } = img;
                const ratio = Math.min(maxWidth / width, maxWidth / height);

                if (ratio < 1) {
                    width *= ratio;
                    height *= ratio;
                }

                canvas.width = width;
                canvas.height = height;

                // Draw and compress the image
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Image compression failed'));
                        }
                    },
                    'image/jpeg',
                    quality
                );
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = URL.createObjectURL(file);
        });
    };

    // Enhanced image upload handler with validation and compression
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setErrors([]);
        setIsProcessing(true);

        try {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                throw new Error('Please upload a valid image file (PNG, JPG, GIF, etc.)');
            }

            // Validate file size
            if (file.size > MAX_FILE_SIZE) {
                throw new Error(`Image must be smaller than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
            }

            // Clean up previous image URL if it exists
            if (designImage && designImage.startsWith('blob:')) {
                URL.revokeObjectURL(designImage);
            }

            // Compress the image
            const compressedBlob = await compressImage(file);

            // Create object URL for the compressed image
            const imageUrl = URL.createObjectURL(compressedBlob);
            setDesignImage(imageUrl);

            // Show compression info
            // const compressionRatio = ((file.size - compressedBlob.size) / file.size * 100).toFixed(1);


        } catch (error) {
            setErrors([error.message]);
        } finally {
            setIsProcessing(false);
        }
    };

    // Convert blob URL back to base64 for backend submission
    const blobToBase64 = (blobUrl) => {
        return new Promise((resolve, reject) => {
            fetch(blobUrl)
                .then(response => response.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                })
                .catch(reject);
        });
    };

    // Generate SVG markup string including shirt outline and uploaded image
    function generateSVGMarkup({ shirtSVGPath, designImage }) {
        const shirtWidth = 400;
        const shirtHeight = 400;
        const imageWidth = 160;
        const imageHeight = 160;
        const imageX = 80;
        const imageY = 120;

        return `
<svg width="${shirtWidth}" height="${shirtHeight}" xmlns="http://www.w3.org/2000/svg">
  <image href="${shirtSVGPath}" x="0" y="0" width="${shirtWidth}" height="${shirtHeight}" />
  <image href="${designImage}" x="${imageX}" y="${imageY}" width="${imageWidth}" height="${imageHeight}" />
</svg>
`;
    }

    // Handle form submission with improved error handling
    async function handleSubmit(e) {
        e.preventDefault();
        setErrors([]);

        if (!designImage || !title) {
            setErrors(["Title and image are required"]);
            return;
        }

        setIsProcessing(true);

        try {
            // Convert blob URL to base64 for backend
            const base64Image = await blobToBase64(designImage);

            // Build SVG markup
            const svgMarkup = generateSVGMarkup({
                shirtSVGPath: SHIRT_SVG_PATH,
                designImage: base64Image,
            });

            // Send to backend
            const result = await dispatch(thunkCreateDesign({
                title,
                svg_data: svgMarkup,
                description,
            }));

            // Handle result
            if (result?.error) {
                setErrors([result.error]);
            } else if (result?.id) {
                // Clean up blob URL before navigation
                if (designImage && designImage.startsWith('blob:')) {
                    URL.revokeObjectURL(designImage);
                }
                navigate(`/designs/${result.id}`);
            } else {
                setErrors(["Something went wrong"]);
            }
        } catch (error) {
            setErrors(["Failed to process design. Please try again."]);
            console.error('Submit error:', error);
        } finally {
            setIsProcessing(false);
        }
    }

    // Clean up blob URLs on component unmount
    useEffect(() => {
        return () => {
            if (designImage && designImage.startsWith('blob:')) {
                URL.revokeObjectURL(designImage);
            }
        };
    }, [designImage]);

    return (
        <form
            className="design-editor"
            onSubmit={handleSubmit}
            style={{
                maxWidth: 460,
                margin: "36px auto",
                padding: 24,
                background: "#fff",
                borderRadius: 8
            }}
        >
            <h2>Post Your Shirt Design</h2>

            {/* Canvas Preview */}
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
                {isProcessing && (
                    <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "16px",
                        fontWeight: "bold"
                    }}>
                        Processing image...
                    </div>
                )}
            </div>

            {/* File Upload */}
            <label style={{ display: "block", marginBottom: "1.5em" }}>
                Upload your design (PNG/JPG - Max {MAX_FILE_SIZE / (1024 * 1024)}MB)
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isProcessing}
                    style={{
                        display: "block",
                        margin: "0.5em 0 0 0",
                        opacity: isProcessing ? 0.6 : 1
                    }}
                />
                <small style={{ color: "#666", fontSize: "12px", display: "block", marginTop: "4px" }}>
                    Images will be automatically compressed and resized for optimal performance
                </small>
            </label>

            {/* Title Input */}
            <label style={{ display: "block", marginBottom: "1em" }}>
                Title
                <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    disabled={isProcessing}
                    style={{
                        width: "100%",
                        marginTop: 6,
                        padding: 8,
                        opacity: isProcessing ? 0.6 : 1
                    }}
                />
            </label>

            {/* Description Input */}
            <label style={{ display: "block", marginBottom: "1em" }}>
                Description
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={5}
                    disabled={isProcessing}
                    style={{
                        width: "100%",
                        marginTop: "0.5em",
                        resize: "vertical",
                        minHeight: 80,
                        boxSizing: "border-box",
                        fontSize: 16,
                        opacity: isProcessing ? 0.6 : 1
                    }}
                    placeholder="Enter your description here..."
                />
            </label>

            {/* Error Display */}
            {errors.length > 0 && (
                <div style={{
                    backgroundColor: "#f8d7da",
                    color: "#721c24",
                    padding: "12px",
                    borderRadius: "4px",
                    marginBottom: "16px",
                    border: "1px solid #f5c6cb"
                }}>
                    <ul style={{ margin: 0, paddingLeft: "20px" }}>
                        {errors.map((err, i) => (
                            <li key={i}>{err}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isProcessing || !designImage || !title}
                style={{
                    background: isProcessing || !designImage || !title ? "#ccc" : "#855cf8",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    fontSize: 18,
                    fontWeight: "bold",
                    padding: "10px 34px",
                    marginTop: 16,
                    cursor: isProcessing || !designImage || !title ? "not-allowed" : "pointer",
                    display: "block",
                    opacity: isProcessing || !designImage || !title ? 0.6 : 1
                }}
            >
                {isProcessing ? "Processing..." : "Create Design"}
            </button>
        </form>
    );
}

export default DesignEditor;

