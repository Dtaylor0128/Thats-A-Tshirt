import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { thunkDemoLogin } from "../../redux/session";
import LandingPage from "./LandingPage";

function LandingPageContainer() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleLogin() {
        // Handle login logic here, e.g., redirect to login page
        navigate("/login");
    }

    function handleSignup() {
        // Handle signup logic here, e.g., redirect to signup page
        navigate("/signup");
    }

    function handleDemoLogin() {
        dispatch(thunkDemoLogin())
            .then((result) => {
                if (!result || result.error) {
                    //handle/show error
                    alert("Demo login failed.")
                } else {
                    // Successfully logged in, redirect to home
                    navigate()("/home");
                }

            })
            .catch((error) => {
                console.error("Demo login failed:", error);
            });
    }

    return (
        <LandingPage
            onLoginClick={handleLogin}
            onSignupClick={handleSignup}
            onDemoClick={handleDemoLogin}

        />
    );
}

export default LandingPageContainer;
// Notes:
// - This container component connects the LandingPage to the Redux store and handles navigation.
// - It provides functions for login, signup, and demo login that interact with the Redux actions.
// - The `thunkDemoLogin` action is dispatched when the demo button is clicked, and it handles the result to either redirect to the home page or show an error message.
// - The `useNavigate` hook from `react-router-dom` is used to programmatically navigate to different routes based on user actions.
// - The `useDispatch` hook is used to access the Redux dispatch function, allowing the component to dispatch actions to the Redux store.
// - The component is designed to be stateless, relying on props and Redux for state management, making it easy to test and maintain.
// - The `LandingPage` component is imported and rendered with the necessary props for handling user interactions.
// - This structure allows for a clean separation of concerns, where the container handles logic and state
// management, while the presentational component (`LandingPage`) focuses on rendering the UI.