import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkCreateFollow, thunkDeleteFollow, thunkGetFollowers, thunkGetFollowing } from "../../redux/follows";
import './FollowModal.css'

function FollowModal({ userId, show, onClose, currentUser }) {
    const dispatch = useDispatch();

    // Get followers and following from Redux state with null checks
    const followers = useSelector(state => state.follows.followers || []);
    const following = useSelector(state => state.follows.following || []);
    const followsById = useSelector(state => state.follows.byId || {});
    const followsAllIds = useSelector(state => state.follows.allIds || []);

    const [tab, setTab] = useState("followers");

    // Load followers/following when shown
    useEffect(() => {
        if (show && userId) {
            dispatch(thunkGetFollowers(userId));
            dispatch(thunkGetFollowing(userId));
        }
    }, [dispatch, show, userId]);

    // Helper: Check if current user is following this user
    // Look through the follows relationships to see if current user follows this user
    const isFollowing = followsAllIds
        .map(id => followsById[id])
        .some(follow =>
            follow &&
            follow.follower_id === currentUser?.id &&
            follow.followed_id === userId
        );

    // Find the follow relationship ID for unfollowing
    const followRelationship = followsAllIds
        .map(id => followsById[id])
        .find(follow =>
            follow &&
            follow.follower_id === currentUser?.id &&
            follow.followed_id === userId
        );

    const handleFollow = () => {
        // Create follow needs an object with followed_id
        dispatch(thunkCreateFollow({ followed_id: userId }));
    };

    const handleUnfollow = () => {
        // Delete follow needs the follow relationship ID, not user ID
        if (followRelationship) {
            dispatch(thunkDeleteFollow(followRelationship.id));
        }
    };

    if (!show) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{
                background: "#fff",
                borderRadius: 8,
                maxWidth: 330,
                margin: "10% auto",
                padding: 24,
                boxShadow: "0 3px 24px #0002",
                position: "relative"
            }}>
                <button onClick={onClose} style={{
                    position: "absolute",
                    top: 14,
                    right: 20,
                    background: "transparent",
                    border: "none",
                    fontSize: 22,
                    color: "#999",
                    cursor: "pointer"
                }}>×</button>

                <h3 style={{ textAlign: "center" }}>Followers & Following</h3>

                <div style={{ display: "flex", justifyContent: "center", margin: "18px 0" }}>
                    <button
                        onClick={() => setTab("followers")}
                        style={{
                            background: tab === "followers" ? "#6c47f8" : "#eee",
                            color: tab === "followers" ? "#fff" : "#555",
                            padding: "8px 16px",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer"
                        }}
                    >
                        Followers ({followers.length})
                    </button>
                    <button
                        onClick={() => setTab("following")}
                        style={{
                            background: tab === "following" ? "#6c47f8" : "#eee",
                            color: tab === "following" ? "#fff" : "#555",
                            marginLeft: 9,
                            padding: "8px 16px",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer"
                        }}
                    >
                        Following ({following.length})
                    </button>
                </div>

                <ul style={{
                    listStyle: "none",
                    padding: 0,
                    maxHeight: 200,
                    overflowY: "auto",
                    minHeight: 100
                }}>
                    {tab === "followers" && followers && followers.length > 0 ? (
                        followers.map(u => (
                            <li key={u.id} style={{ padding: 7, borderBottom: "1px solid #eee" }}>
                                {u.username}
                                {currentUser && currentUser.id === u.id && " (You)"}
                            </li>
                        ))
                    ) : tab === "followers" ? (
                        <li style={{ padding: 7, color: "#999", textAlign: "center" }}>No followers yet</li>
                    ) : null}

                    {tab === "following" && following && following.length > 0 ? (
                        following.map(u => (
                            <li key={u.id} style={{ padding: 7, borderBottom: "1px solid #eee" }}>
                                {u.username}
                                {currentUser && currentUser.id === u.id && " (You)"}
                            </li>
                        ))
                    ) : tab === "following" ? (
                        <li style={{ padding: 7, color: "#999", textAlign: "center" }}>Not following anyone yet</li>
                    ) : null}
                </ul>

                <div style={{ textAlign: "center", marginTop: 18 }}>
                    {currentUser && currentUser.id !== userId && (
                        isFollowing ? (
                            <button
                                onClick={handleUnfollow}
                                style={{
                                    padding: "8px 16px",
                                    background: "#dc3545",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 4,
                                    cursor: "pointer"
                                }}
                            >
                                Unfollow
                            </button>
                        ) : (
                            <button
                                onClick={handleFollow}
                                style={{
                                    padding: "8px 16px",
                                    background: "#6c47f8",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 4,
                                    cursor: "pointer"
                                }}
                            >
                                Follow
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

export default FollowModal;