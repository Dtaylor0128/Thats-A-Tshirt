import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import DesignEditor from '../components/DesignEditor/DesignEditor';
//import DesignPage from '../components/DesignPage/DesignPage';
import CreatePostPage from '../components/CreatePostPage/CreatePostPage';
import PostDetailPage from '../components/PostDetailPage/PostDetailPage';
import PostsPage from '../components/PostsPage/PostsPage';
import EditPostPage from '../components/EditPostPage/EditPostPage';
import EditDesignPage from '../components/EditDesignPage/EditDesignPage';
import TestingPage from '../components/Test/TestingComponent';
export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome!</h1>,
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
      // {
      //   path: "designs/:id",
      //   element: <DesignPage />,
      // },
      {
        path: "designs/:id/edit",
        element: <EditDesignPage />,
      },
      {
        path: "Test",
        element: <TestingPage />,
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
        path: "posts",
        element: <PostsPage />,
      },
      {
        path: "posts/:id/edit",
        element: <EditPostPage />,
      },
    ],
  },
]);