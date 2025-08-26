import { useDispatch, useSelector } from "react-redux";
import { thunkCreateLike, thunkDeleteLike } from "../../redux/likes"; // adjust path as needed

function LikeButton({ postId, currentUser }) {
    const dispatch = useDispatch();

    // Find user's like object (if any)
    const userLike = useSelector(state =>
        state.likes.allIds
            .map(id => state.likes.byId[id])
            .find(like => like.post_id === postId && like.user_id === currentUser.id)
    );
    const likeCount = useSelector(state =>
        state.likes.allIds
            .map(id => state.likes.byId[id])
            .filter(like => like.post_id === postId).length
    );

    const isLiked = !!userLike; // true if like exists

    const handleLike = () => {
        if (isLiked) {
            dispatch(thunkDeleteLike(userLike.id));
        } else {
            dispatch(thunkCreateLike(postId));
        }
    };

    return (
        <button onClick={handleLike}>

            {isLiked ? "Unlike" : "Like"}
            <span>{likeCount} {likeCount === 1 ? "like" : "likes"}</span>
        </button>

    );
}
export default LikeButton;