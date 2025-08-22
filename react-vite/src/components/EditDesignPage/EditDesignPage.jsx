import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { thunkGetDesignById, thunkEditDesign, thunkDeleteDesign } from "../store/designs";
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
            dispatch(thunkGetDesignById(id));
        } else {
            setTitle(design.title);
            setSvg(design.svg);
        }
    }, [dispatch, id, design]);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await dispatch(thunkEditDesign({ id, title, svg }));
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
            navigate("/designs");
        } catch (err) {
            setError("Failed to delete. Try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!design) return <div className="edit-page__loading">Loading…</div>;

    return (
        <div className="edit-page grid-container">
            <h2 className="edit-page__header">Edit Design</h2>
            <form className="edit-form" onSubmit={handleSave}>
                <label className="edit-form__label">
                    Title
                    <input
                        className="edit-form__input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </label>
                <label className="edit-form__label">
                    SVG Markup
                    <textarea
                        className="edit-form__textarea"
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
                        className="edit-form__button edit-form__button--danger"
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