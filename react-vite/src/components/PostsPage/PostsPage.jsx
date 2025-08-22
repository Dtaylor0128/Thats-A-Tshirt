// post feed/ list page
// - this page allows users to browse all posts, (through home page and /posts)
// -reusable component

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetPosts } from "../../redux/posts";
import { Link } from "react-router-dom";

function PostsPage() {
    const dispatch = useDispatch();
    const posts = useSelector(state =>
        state.posts?.allIDs?.map(id => state.posts.byID[id])
    );

    useEffect(() => {
        dispatch(thunkGetPosts());
    }, [dispatch]);

    if (!posts.length || !posts) return <div>Loading posts...</div>;

    return (
        <div>
            <h2>All Posts</h2>
            <Link to="/posts/new">
                <button style={{ marginBottom: "1em" }}>Create Post</button>
            </Link>

            <ul>
                {posts.map(post =>
                    <li key={post.id}>
                        <Link to={`/posts/${post.id}`}>
                            <strong>{post.title}</strong>
                        </Link>
                        <div>{post.description}</div>
                        {/* If you have thumbnails/images, show here */}
                    </li>
                )}
            </ul>
        </div>
    );
}

export default PostsPage;