import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { thunkGetDesign, thunkUpdateDesign, thunkDeleteDesign } from "../../redux/designs";
import "./EditDesignPage.css";

const EditDesignPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const design = useSelector((state) => state.designs.byId[id]);
    const [title, setTitle] = useState("");
    const [svg, setSvg] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Load design on mount
    useEffect(() => {
        if (!design) {
            dispatch(thunkGetDesign(id));
        } else {
            setTitle(design.title);
            setSvg(design.svg_data || "");
        }
    }, [dispatch, id, design]);

    const handleSave = async (e) => {
        e.preventDefault();
        console.log("Save handler fired");
        setLoading(true);
        setError(null);
        try {
            await dispatch(thunkUpdateDesign(id, { title, svg_data: svg }));
            navigate(`/designs/${id}`);
        } catch (err) {
            setError("Failed to save. Check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this design?")) return;
        setLoading(true);
        setError(null);
        try {
            await dispatch(thunkDeleteDesign(id));
            // After delete: refresh or navigate away
            navigate("/designs/");
        } catch (err) {
            setError("Failed to delete. Try again.");
        } finally {
            setLoading(false);
        }
    };



    if (!design) return <div>Loading…</div>;

    return (
        <div className="edit-page grid-container">
            <h2 className="edit-page-header">Edit Design</h2>
            <form className="edit-form" onSubmit={handleSave}>
                <label className="edit-form-label">
                    Title
                    <input
                        className="edit-form-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </label>
                <label className="edit-form-label">
                    SVG Markup
                    <textarea
                        className="edit-form-textarea"
                        value={svg}
                        onChange={(e) => setSvg(e.target.value)}
                        rows={10}
                    />
                </label>
                <div className="edit-form__actions">
                    <button
                        className="edit-form__button edit-form__button--primary"
                        type="submit"
                        disabled={loading}
                    >
                        Save
                    </button>
                    <button
                        className="edit-form__button delete"
                        type="button"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        Delete
                    </button>

                </div>
                {error && <p className="edit-form__error">{error}</p>}
            </form>
            <div className="edit-preview">
                <h3 className="edit-preview__header">Live Preview</h3>
                <div
                    className="edit-preview__svg"
                    dangerouslySetInnerHTML={{ __html: svg }}
                />
            </div>
        </div>
    );
};

export default EditDesignPage;