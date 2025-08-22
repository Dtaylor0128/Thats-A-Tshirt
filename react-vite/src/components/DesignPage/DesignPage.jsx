import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetDesigns } from "../../redux/designs";
import { Link } from "react-router-dom";
import "./DesignPage.css"

function DesignPage() {
    const dispatch = useDispatch();
    const designs = useSelector(state =>
        state.designs?.allIds?.map(id => state.designs.byId[id]) ?? []
    );

    useEffect(() => {
        dispatch(thunkGetDesigns());
    }, [dispatch]);

    if (!designs.length) return <div>Loading designs...</div>;


    return (
        <div className="designs-grid">
            {designs.map(design => (
                <div className="design-card" key={design.id}>
                    <div className="design-svg-thumb"
                        dangerouslySetInnerHTML={{ __html: design.svg_data }} />
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
                    </div>
                </div>
            ))}
        </div>
    )


    // return (
    //     <div style={{
    //         display: "flex",
    //         flexWrap: "wrap",
    //         gap: "24px",
    //         justifyContent: "flex-start",
    //         maxWidth: 850,
    //         margin: "auto"
    //     }}>
    //         {designs.map(design => (
    //             <div key={design.id}
    //                 style={{
    //                     width: 180,
    //                     minHeight: 250,
    //                     border: "1px solid #ddd",
    //                     borderRadius: 8,
    //                     padding: 10,
    //                     marginBottom: 18,
    //                     background: "#fff",
    //                     boxSizing: "border-box",
    //                     display: "flex",
    //                     flexDirection: "column",
    //                     alignItems: "center"
    //                 }}
    //             >
    //                 <div
    //                     style={{
    //                         width: 120,
    //                         height: 120,
    //                         display: "flex",
    //                         alignItems: "center",
    //                         justifyContent: "center",
    //                         overflow: "hidden",
    //                         marginBottom: 12,
    //                         border: "1px solid #eee",
    //                         background: "#faf9f7"
    //                     }}
    //                 >
    //                     <div
    //                         dangerouslySetInnerHTML={{ __html: design.svg_data }}
    //                         style={{
    //                             width: "100%",
    //                             height: "100%",
    //                             display: "block"
    //                         }}
    //                     />
    //                 </div>
    //                 <Link to={`/designs/${design.id}`}>
    //                     <strong style={{ fontSize: "1.1em" }}>{design.title}</strong>
    //                 </Link>
    //                 <div style={{ fontSize: "0.95em", color: "#444", marginTop: 6 }}>{design.description}</div>
    //             </div>
    //         ))}
    //     </div>
    // );
}

export default DesignPage;