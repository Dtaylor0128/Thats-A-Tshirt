import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { thunkGetPosts } from "../../redux/posts";

function MyPostsPage() {
    const { userId } = useParams();
    const dispatch = useDispatch();

    const posts = useSelector(state =>
        state.posts.allIds
            .map(id => state.posts.byId[id])
            .filter(post => post && post.user_id === Number(userId))
    );

    // Fetch posts when component mounts
    useEffect(() => {
        dispatch(thunkGetPosts());
    }, [dispatch]);

    if (!posts.length) return <div>No posts found for this user.</div>;

    return (
        <div className="my-posts-page">
            <h2>Users Posts</h2>
            {posts.map(post => (
                <div key={post.id} className="post-card">
                    <div
                        dangerouslySetInnerHTML={{ __html: post.svg_data }}
                        style={{
                            border: "1px solid #ccc",
                            minHeight: 160,
                            minWidth: 160,
                            maxWidth: 340,
                            margin: "0 auto 10px"
                        }}
                    />
                    <h3>{post.title}</h3>
                    <div>{post.caption}</div>
                </div>
            ))}
        </div>
    );
}

export default MyPostsPage;