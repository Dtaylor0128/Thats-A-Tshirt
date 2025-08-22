import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { thunkGetPost, thunkDeletePost } from "../../redux/posts";



function PostDetailPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const { id } = useParams();
    const post = useSelector(state => state.posts?.byID?.[id]);
    // const post = useSelector(state => state.posts?.allIDs?.map(id => state.posts.byID[id]));



    useEffect(() => {
        if (id) {
            dispatch(thunkGetPost(id)).then(result => {
                if (result?.error) {
                    setError(result.status === 403 ? "You do not have permission to view this post." : result.error);
                }
            });
        }
    }, [dispatch, id]);

    if (error) return <div style={{ color: "red" }}>{error}</div>;
    if (!post) return <div>Loading post...</div>;

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            const result = await dispatch(thunkDeletePost(id));
            if (result === true) {
                navigate("/posts"); // redirect to feed after delete
            }
        }
    };


    return (
        <div className="post-detail-page">
            <h2>{post.title}</h2>
            <p>{post.description}</p>
            <Link to={`/posts/${id}/edit`}>
                <button>Edit Post</button>
            </Link>
            <button onClick={handleDelete} style={{ color: "red", marginLeft: "1em" }}>
                Delete
            </button>
        </div>

    );
}
export default PostDetailPage;