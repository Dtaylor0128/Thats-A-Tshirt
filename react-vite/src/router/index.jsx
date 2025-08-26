import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import DesignEditor from '../components/DesignEditor/DesignEditor';
import DesignPage from '../components/DesignPage/DesignPage';
import CreatePostPage from '../components/CreatePostPage/CreatePostPage';
import PostDetailPage from '../components/PostDetailPage/PostDetailPage';
import PostsPage from '../components/PostsPage/PostsPage';
import EditPostPage from '../components/EditPostPage/EditPostPage';
import EditDesignPage from '../components/EditDesignPage/EditDesignPage';
import LandingPage from '../components/LandingPage/LandingPage';
import MyPostsPage from '../components/MyPostsPage/MyPostsPage';
export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "design/new",
        element: <DesignEditor />,
      },
      {
        path: "designs",
        element: <DesignPage />,
      },
      {
        path: "designs/:id",
        element: <DesignPage />,
      },
      {
        path: "designs/:id/edit",
        element: <EditDesignPage />,
      },

      {
        path: "posts/new",
        element: <CreatePostPage />,
      },
      {
        path: "posts/:id",
        element: <PostDetailPage />,
      },
      {
        path: "posts/:id",
        element: <PostDetailPage />,
      },
      {
        path: "posts",
        element: <PostsPage />,
      },
      {
        path: "posts/:id/edit",
        element: <EditPostPage />,
      },
      {
        path: "users/:id/posts",
        element: <MyPostsPage />,
      },
    ],
  },
]);