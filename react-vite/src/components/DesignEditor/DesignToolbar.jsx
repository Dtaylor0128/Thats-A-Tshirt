// designToolbar.jsx

//import PropTypes from "prop-types";

function DesignToolbar({ onAddShape, onAddText, onAddImage, onShirtColorChange, onClear }) {
    return (
        <div className="design-toolbar">
            <button onClick={() => onAddShape("circle")}>Add Circle</button>
            <button onClick={() => onAddShape("rect")}>Add Rectangle</button>
            <button onClick={onAddText(prompt("Enter Text:"))}>Add Text</button>

            <input
                type="file"
                accept="image/*"
                onChange={onAddImage}
                style={{ display: "none" }}
                ref={(ref) => (this.fileInput = ref)}
            />
            <button onClick={() => this.fileInput.click()}>Upload Image</button>
            <input
                type="color"
                onChange={(e) => onShirtColorChange(e.target.value)}
                title="Change Shirt Color"
            />
            <button onClick={onClear}>Clear Design</button>
        </div>
    );
}

export default DesignToolbar;