import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetDesigns, thunkDeleteDesign } from "../../redux/designs";
import { useNavigate, Link } from "react-router-dom";
import "./DesignPage.css";

function DesignPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get normalized slice from Redux
    const designsState = useSelector(state => state.designs);

    // Memoize the derived array so reference doesn't change unless data changes
    const designs = useMemo(
        () => (designsState?.allIds?.map(id => designsState.byId[id]) ?? []),
        [designsState.allIds, designsState.byId]
    );

    useEffect(() => {
        dispatch(thunkGetDesigns());
    }, [dispatch]);

    if (!designs.length) return <div>Loading designs...</div>;

    return (
        <div>
            {designs.map(design => (
                <div className="design-card" key={design.id}>
                    <div className="design-svg-thumb" dangerouslySetInnerHTML={{ __html: design.svg_data }} />
                    <Link to={`/designs/${design.id}`} className="design-title">
                        <strong>{design.title}</strong>
                    </Link>
                    <div className="design-desc">{design.description}</div>
                    <div className="design-card-actions">
                        <Link to={`/designs/${design.id}/edit`}>
                            <button className="edit-btn">Edit</button>
                        </Link>
                        <button
                            className="delete-btn"
                            onClick={() => handleDelete(design.id)}
                        >
                            Delete
                        </button>
                        <button
                            className="edit-form__button"
                            type="button"
                            onClick={() => handleCreatePost(design)}
                            style={{ backgroundColor: "#6c47f8", color: "#fff", marginLeft: 8 }}
                        >
                            Create Post
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default DesignPage;