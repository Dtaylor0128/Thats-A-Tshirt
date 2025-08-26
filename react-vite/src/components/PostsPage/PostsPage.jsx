import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { thunkGetPosts, thunkDeletePost } from "../../redux/posts";
import FollowModal from "../FollowModal/FollowModal";

function PostsPage() {
    const dispatch = useDispatch();
    // const navigate = useNavigate();

    const currentUser = useSelector(state => state.session.user);
    const allIds = useSelector(state => state.posts.allIds);
    const byId = useSelector(state => state.posts.byId);
    const userId = currentUser?.id;

    const [showFollow, setShowFollow] = useState(false);
    // For demo, let's make userIdYouWantToView the current user. You can change this logic as needed.
    const userIdYouWantToView = currentUser?.id;

    const posts = useMemo(() =>
        allIds
            .map(id => byId[id])
            .filter(post => post && post.user_id === userId)
        , [allIds, byId, userId]);

    useEffect(() => {
        dispatch(thunkGetPosts());
    }, [dispatch]);

    if (!currentUser) return <div>Please log in to see your posts.</div>;
    if (!posts.length) return <div>No posts found.</div>;

    const handleDelete = async (id) => {
        if (window.confirm("Delete this post?")) {
            await dispatch(thunkDeletePost(id));
        }
    };

    return (
        <div className="posts-feed">
            {posts.map(post => (
                <div key={post.id} className="post-card">
                    <div
                        dangerouslySetInnerHTML={{ __html: post.svg_data }}
                        style={{
                            border: "1px solid #ccc",
                            minHeight: 160,
                            minWidth: 160,
                            maxWidth: 340,
                            margin: "0 auto"
                        }}
                    />
                    <h3>{post.title}</h3>
                    <div>{post.caption}</div>
                    <Link to={`/posts/${post.id}`}>
                        <button>View</button>
                    </Link>
                    <Link to={`/posts/${post.id}/edit`}>
                        <button>Edit</button>
                    </Link>
                    <button style={{ marginLeft: "1em" }} onClick={() => handleDelete(post.id)}>Delete</button>
                    <button onClick={() => setShowFollow(true)}>Followers & Following</button>
                    <FollowModal
                        userId={userIdYouWantToView}
                        show={showFollow}
                        onClose={() => setShowFollow(false)}
                        currentUser={currentUser}
                    />
                </div>
            ))}
        </div>
    );
}

export default PostsPage;