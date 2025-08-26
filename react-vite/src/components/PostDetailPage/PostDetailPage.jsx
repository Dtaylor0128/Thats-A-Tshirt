import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { thunkGetPost, thunkDeletePost } from "../../redux/posts";
import { thunkCreateLike, thunkDeleteLike } from "../../redux/likes";
import CommentsSection from "../CommentsSection/CommentsSection";

function PostDetailPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { postId } = useParams();
    const post = useSelector(state => state.posts.byId[Number(postId)]);
    const currentUser = useSelector(state => state.session.user);

    useEffect(() => {
        if (postId) dispatch(thunkGetPost(postId));
    }, [dispatch, postId]);

    const userLike = useSelector(state =>
        state.likes.allIds
            .map(id => state.likes.byId[id])
            .find(like => like.post_id === post?.id && like.user_id === currentUser?.id)
    );
    const isLiked = !!userLike;
    const likeCount = useSelector(state =>
        state.likes.allIds
            .map(id => state.likes.byId[id])
            .filter(like => like.post_id === post?.id).length
    );

    const handleLike = () => {
        if (isLiked) {
            dispatch(thunkDeleteLike(userLike.id));
        } else {
            dispatch(thunkCreateLike(post.id));
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            const result = await dispatch(thunkDeletePost(postId));
            if (result === true) navigate("/posts");
        }
    };

    if (!post) return <div>Loading post...</div>;


    return (
        <div className="post-detail-page">
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
            <button onClick={handleLike}>{isLiked ? "Unlike" : "Like"}</button>
            <span style={{ marginLeft: 12 }}>{likeCount} {likeCount === 1 ? "like" : "likes"}</span>
            <Link to={`/posts/${post.id}/edit`}>
                <button>Edit</button>
            </Link>
            <button style={{ marginLeft: "1em" }} onClick={handleDelete}>
                Delete
            </button>
            <CommentsSection postId={post.id} currentUser={currentUser} />
        </div>
    );
}

export default PostDetailPage;