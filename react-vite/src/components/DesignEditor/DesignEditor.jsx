import { useRef, useState } from "react";
import TshirtCanvas from "./TshirtCanvas";
import DesignToolbar from "./DesignToolbar";
import DesignSidebar from "./DesignSidebar";
import "./DesignEditor.css";

/**
 * DesignEditor
 * manages design state (colors, shapes, text)
 * passes revevant props/fn to TshirtCanvas and DesignToolbar
 *  
*/

function DesignEditor() {
    // state: designLayers = [{type: 'shape'|'text', content: {...} }]
    const [designLayers, setDesignLayers] = useState([]);
    const [shirtColor, setShirtColor] = useState("#f8f8f8");
    const fileInputRef = useRef();

    // New: Add image layer
    function addImage(imageDataURL) {
        setDesignLayers([
            ...designLayers,
            {
                type: "image",
                src: imageDataURL,
                x: 110, // default position
                y: 110,
                width: 100,
                height: 100,
            },
        ]);
    }

    // New: Handle file uploads
    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // e.target.result is a data URL (works as <img src=...>)
                addImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }
    // called from toolbar
    function triggerFileDialog() {
        fileInputRef.current.click();
    }

    // handlers
    function addShape(shapeType) {
        setDesignLayers([...designLayers, { type: "shape", shape: shapeType }]);
    }
    function addText(text) {
        setDesignLayers([...designLayers, { type: "text", text }]);
    }
    function updateShirtColor(color) {
        setShirtColor(color);

    }

    function clearDesign() {
        setDesignLayers([]);
        setShirtColor("#f8f8f8"); // reset to default shirt color
    }


    return (
        <div className="design-editor-root">
            <DesignToolbar
                onAddShape={addShape}
                onAddText={addText}
                onSetShirtColor={updateShirtColor}
                onClear={clearDesign}
                onAddImage={triggerFileDialog}
            />
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageUpload}
            />
            <TshirtCanvas
                shirtColor={shirtColor}
                layers={designLayers}
            />
            <DesignSidebar
                layers={designLayers}
                shirtColor={shirtColor}
                onSave={() => {/* Save design to backend or pass up! */ }}
            />
        </div>
    );
}

export default DesignEditor;