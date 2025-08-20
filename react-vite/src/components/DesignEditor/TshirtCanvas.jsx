/**
 * TshirtCanvas
 * Render the tshirt base SVG and current design layers on top
 * 
 */

import PropTypes from "prop-types";
import "./TshirtCanvas.css";

function TshirtCanvas({ shirtColor, layers }) {
    return (
        <svg width="320" height="400" className="tshirt-canvas">
            {/* Simple shirt body (just for demo—replace with your SVG asset) */}
            <rect x="60" y="50" width="200" height="300" fill={shirtColor} rx="40" />
            {/* Render design layers */}
            {layers.map((layer, idx) => {
                if (layer.type === "shape") {
                    return (
                        <circle key={idx} cx={160} cy={200} r={40} fill="#ff6892" />
                    );
                }
                if (layer.type === "text") {
                    return (
                        <text key={idx} x={160} y={200 + idx * 40} fill="#212121" fontSize="28" textAnchor="middle">
                            {layer.text}
                        </text>
                    );
                }
                return null;
            })}
        </svg>
    );
}
