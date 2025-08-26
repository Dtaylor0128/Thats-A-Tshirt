import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkCreateComment, thunkUpdateComment, thunkDeleteComment, thunkGetComments } from "../../redux/comments";

function CommentsSection({ postId, currentUser }) {
    const dispatch = useDispatch();

    useEffect(() => {
        if (postId) dispatch(thunkGetComments(postId));
    }, [dispatch, postId]);


    const comments = useSelector((state) => state.comments.allIds.map((id) => state.comments.byId[id]).filter(comment => comment && comment.post_id === postId)
    );
    const [newComment, setNewComment] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingValue, setEditingValue] = useState("");
    const [error, setError] = useState(null);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError(null);
        if (!newComment.trim()) return setError("Comment can't be empty");
        const res = await dispatch(thunkCreateComment(postId, { content: newComment }));
        if (!res?.error) setNewComment("");
        else setError(res.error || "Failed to create comment");
    };

    const handleDelete = async (commentId) => {
        if (window.confirm("Delete this comment?")) {
            await dispatch(thunkDeleteComment(commentId));
        }
    };

    const startEdit = (comment) => {
        setEditingId(comment.id);
        setEditingValue(comment.content);
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        if (!editingValue.trim()) return setError("Comment can't be empty");
        const res = await dispatch(thunkUpdateComment(editingId, { content: editingValue }));
        if (!res?.error) {
            setEditingId(null);
            setEditingValue("");
        } else setError(res.error || "Failed to update comment");
    };

    return (
        <div>
            <h3>Comments</h3>
            {comments.length === 0 && <p>No comments yet.</p>}
            <ul>
                {comments.map((comment) => (
                    <li key={comment.id} style={{ marginBottom: 16 }}>
                        {editingId === comment.id ? (
                            <form onSubmit={handleEdit} style={{ display: "inline" }}>
                                <input
                                    value={editingValue}
                                    onChange={(e) => setEditingValue(e.target.value)}
                                    style={{ marginRight: 8, width: 250 }}
                                    autoFocus
                                />
                                <button type="submit">Save</button>
                                <button type="button" onClick={() => setEditingId(null)}>
                                    Cancel
                                </button>
                            </form>
                        ) : (
                            <>
                                <span style={{ fontWeight: "bold" }}>{comment.user?.username || "User"}</span>
                                {": "}
                                <span>{comment.content}</span>
                                {currentUser && comment.user_id === currentUser.id && (
                                    <>
                                        <button onClick={() => startEdit(comment)} style={{ marginLeft: 8 }}>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            style={{ marginLeft: 4, color: "red" }}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </li>
                ))}
            </ul>
            <form onSubmit={handleCreate} style={{ marginTop: 16 }}>
                <input
                    placeholder="Write a comment…"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    style={{ width: 250 }}
                />
                <button type="submit" style={{ marginLeft: 8 }}>
                    Add Comment
                </button>
            </form>
            {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        </div>
    );
}

export default CommentsSection;