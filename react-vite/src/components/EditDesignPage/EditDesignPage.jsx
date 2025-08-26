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
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load design (once)
    useEffect(() => {
        if (!design && !loading) {
            setLoading(true);
            dispatch(thunkGetDesign(id)).finally(() => setLoading(false));
        } else if (design) {
            setTitle(design.title || "");
            setDescription(design.description || "");
        }
    }, [dispatch, id, design, loading]);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true); setError(null);
        try {
            await dispatch(thunkUpdateDesign(id, { title, description }));
            navigate(`/designs/${id}`);
        } catch (err) {
            setError("Failed to save. Check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Delete this design?")) {
            setLoading(true); setError(null);
            try {
                await dispatch(thunkDeleteDesign(id));
                navigate("/designs");
            } catch {
                setError("Failed to delete.");
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) return <div>Loading…</div>;
    if (!design) return <div>Design not found. It may have been deleted.</div>;
    return (
        <form className="edit-form" onSubmit={handleSave}>
            {/* SVG Preview above title/description */}
            <div
                className="edit-preview__svg"
                style={{ textAlign: "center", marginBottom: "1.5em" }}
                dangerouslySetInnerHTML={{ __html: design.svg_data }}
            />
            <label>
                Title:
                <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                />
            </label>
            <label>
                Description:
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={6}
                />
            </label>
            {error && <div className="edit-form__error">{error}</div>}
            <button type="submit" disabled={loading}>Save</button>
            <button type="button" onClick={handleDelete} disabled={loading}>Delete</button>
        </form>
    );
};


export default EditDesignPage;