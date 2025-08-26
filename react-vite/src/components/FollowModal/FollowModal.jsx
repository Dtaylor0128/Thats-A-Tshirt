import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkCreateFollow, thunkDeleteFollow, thunkGetFollowers, thunkGetFollowing } from "../../redux/follows";
import './FollowModal.css'

function FollowModal({ userId, show, onClose, currentUser }) {
    const dispatch = useDispatch();
    const followers = useSelector(state => state.follows.followers);
    const following = useSelector(state => state.follows.following);
    const [tab, setTab] = useState("followers");

    // Load followers/following when shown
    useEffect(() => {
        if (show && userId) {
            dispatch(thunkGetFollowers(userId));
            dispatch(thunkGetFollowing(userId));
        }
    }, [dispatch, show, userId]);

    // Helper: Check if current user is following this user
    const isFollowing = following.some(u => u.id === userId);

    const handleFollow = () => dispatch(thunkCreateFollow(userId));
    const handleUnfollow = () => dispatch(thunkDeleteFollow(userId));

    if (!show) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{
                background: "#fff", borderRadius: 8, maxWidth: 330, margin: "10% auto", padding: 24, boxShadow: "0 3px 24px #0002"
            }}>
                <button onClick={onClose} style={{
                    position: "absolute", top: 14, right: 20, background: "transparent", border: "none", fontSize: 22, color: "#999", cursor: "pointer"
                }}>×</button>
                <h3 style={{ textAlign: "center" }}>Followers & Following</h3>
                <div style={{ display: "flex", justifyContent: "center", margin: "18px 0" }}>
                    <button onClick={() => setTab("followers")} style={{
                        background: tab === "followers" ? "#6c47f8" : "#eee", color: tab === "followers" ? "#fff" : "#555"
                    }}>Followers</button>
                    <button onClick={() => setTab("following")} style={{
                        background: tab === "following" ? "#6c47f8" : "#eee", color: tab === "following" ? "#fff" : "#555", marginLeft: 9
                    }}>Following</button>
                </div>
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {tab === "followers" && followers.map(u => (
                        <li key={u.id} style={{ padding: 7, borderBottom: "1px solid #eee" }}>
                            {u.username}
                            {currentUser && currentUser.id === u.id && " (You)"}
                        </li>
                    ))}
                    {tab === "following" && following.map(u => (
                        <li key={u.id} style={{ padding: 7, borderBottom: "1px solid #eee" }}>
                            {u.username}
                            {currentUser && currentUser.id === u.id && " (You)"}
                        </li>
                    ))}
                </ul>
                <div style={{ textAlign: "center", marginTop: 18 }}>
                    {currentUser && currentUser.id !== userId && (
                        isFollowing
                            ? <button onClick={handleUnfollow}>Unfollow</button>
                            : <button onClick={handleFollow}>Follow</button>
                    )}
                </div>
            </div>
        </div>
    );
}
export default FollowModal;