// presentational component for the landing page
//import PropTypes from 'prop-types';

/*
- LandingPage
- Public- facing component that serves as the entry point for users.
- Shows Headline, brief app description, and call to action buttons with hero image

- Props:
- onloginClick: function to call when login button is clicked
- onSignupClick: function to call when signup button is clicked

- onDemoClick: function to call when demo button is clicked ( auto fill creditials and redirect to home page)

- Thisis a presentational component that does not manage any state. it will only recieve props
- and render the UI accordingly.

*/

// function LandingPage({ onLoginClick, onSignupClick, onDemoClick }) {
//     return (
//         <div className="landing-root">
//             <header className="Landing-header">
//                 <h1>That&apos;s A Tshirt</h1>
//                 <p className="tagline"> Create. Share. Wear. Social T-shirt design for everyone.</p>
//             </header>
//             <section className="hero-section">
//                 <img
//                     src="/images/hero-image.png"
//                     alt="Hero" className="hero-image"
//                 />
//             </section>
//             <section className="landing-description">
//                 <p>
//                     Design your own custom tees, share with friends and discover the latest trends- all in one easy-to-use platform.
//                 </p>
//             </section>

//             <section className="cta-buttons">
//                 <button className="cta-button-login" onClick={onLoginClick}>Log in</button>
//                 <button className="cta-button-signup" onClick={onSignupClick}>Sign Up</button>
//                 <button
//                     className="cta-button-demo"
//                     onClick={onDemoClick}
//                     aria-label="Try DemoUser"
//                 >
//                     Demo User</button>
//             </section>
//         </div >
//     );
// }

// LandingPage.propTypes = {
//     onLoginClick: PropTypes.func.isRequired,
//     onSignupClick: PropTypes.func.isRequired,
//     onDemoClick: PropTypes.func.isRequired
// };

// LandingPage.defaultProps = {
//     onLoginClick: () => { },
//     onSignupClick: () => { },
//     onDemoClick: () => { }
// };

// export default LandingPage;
// Notes:
// - This component is a functional component that receives props for handling login, signup, and demo
// - It renders a header with the app name and tagline, a hero image, a brief description, and call-to-action buttons
// - The buttons trigger the respective functions passed as props when clicked
// - The component uses PropTypes for type checking to ensure the required functions are provided
// - The CSS classes used (e.g., "landing-root", "Landing-header", etc.) should be defined in a separate CSS file to style the component appropriately
// - The hero image is assumed to be located in the public/images directory, but this can be adjusted based on your project
// structure
// - This component is stateless and purely presentational, making it easy to test and reuse
// - It can be integrated into a larger application as the landing page component, typically rendered when the user is not authenticated
// - The component can be further enhanced with animations, additional styling, or responsive design features as needed
// - Ensure to import this component in your main application file (
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { thunkDemoLogin } from "../../redux/session";
import { thunkGetDesigns } from "../../redux/designs";
import { thunkGetPosts } from "../../redux/posts";
import './LandingPage.css';
import { FaPalette, FaUsers, FaStar, FaTshirt, FaRocket, FaHeart, FaDownload } from 'react-icons/fa';

function LandingPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    useEffect(() => {
        dispatch(thunkGetDesigns());
        dispatch(thunkGetPosts());
    }, [dispatch]);

    function handleLogin() {
        // Handle login logic here, e.g., redirect to login page
        navigate("/login");
    }

    function handleSignup() {
        // Handle signup logic here, e.g., redirect to signup page
        navigate("/signup");
    }

    // Demo user login
    const handleDemoLogin = async () => {
        const response = await dispatch(thunkDemoLogin());
        if (response && (response.error || response.errors)) {
            setErrors(response);
        } else {
            navigate("/");
        }
    };
    return (
        <div className="landing-root">
            {/* Header */}
            <header className="landing-header">
                <div className="header-content">
                    <div className="logo-section">
                        <FaTshirt className="logo-icon" />
                        <h1 className="brand-title">That&apos;s A T-shirt</h1>
                    </div>
                    <p className="tagline">Design, Create, and Share Amazing T-Shirt Designs</p>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">Design Your Perfect T-Shirt</h1>
                        <p className="hero-description">
                            Create stunning custom t-shirt designs with our professional design tools.
                            Join thousands of creators and bring your ideas to life with our intuitive editor.
                        </p>
                        <div className="hero-stats">
                            <div className="stat-item">
                                <FaPalette className="stat-icon" />
                                <span className="stat-number">10K+</span>
                                <span className="stat-label">Designs</span>
                            </div>
                            <div className="stat-item">
                                <FaUsers className="stat-icon" />
                                <span className="stat-number">5K+</span>
                                <span className="stat-label">Users</span>
                            </div>
                            <div className="stat-item">
                                <FaStar className="stat-icon" />
                                <span className="stat-number">4.9</span>
                                <span className="stat-label">Rating</span>
                            </div>
                        </div>
                    </div>

                    {/* Professional T-shirt Design Preview */}
                    <div className="hero-visual">
                        <div className="design-preview">
                            <div className="shirt-container">
                                <img
                                    src="/assets/white-shirt.jpg"
                                    alt="T-shirt design preview"
                                    className="shirt-image"
                                    draggable={false}
                                />
                                <div className="design-overlay">
                                    <span className="design-text">Your Design Goes Here</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="features-content">
                    <h2 className="features-title">Why Choose Our Design Tool?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <FaPalette className="feature-icon" />
                            <h4>Professional Design Tools</h4>
                            <p>Intuitive drag-and-drop interface with advanced design capabilities, color picker, and professional templates</p>
                        </div>
                        <div className="feature-card">
                            <FaUsers className="feature-icon" />
                            <h4>Creative Community</h4>
                            <p>Share your designs, get inspired by others, and connect with a vibrant community of creators</p>
                        </div>
                        <div className="feature-card">
                            <FaStar className="feature-icon" />
                            <h4>Premium Quality</h4>
                            <p>High-resolution exports and professional-grade designs ready for printing on premium t-shirts</p>
                        </div>
                        <div className="feature-card">
                            <FaRocket className="feature-icon" />
                            <h4>Fast & Easy</h4>
                            <p>Create stunning designs in minutes with our streamlined workflow and instant preview</p>
                        </div>
                        <div className="feature-card">
                            <FaHeart className="feature-icon" />
                            <h4>Social Features</h4>
                            <p>Like, comment, and follow your favorite designers. Build your creative network</p>
                        </div>
                        <div className="feature-card">
                            <FaDownload className="feature-icon" />
                            <h4>Export Options</h4>
                            <p>Download your designs in multiple formats or share them directly to social media</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2 className="cta-title">Ready to Start Designing?</h2>
                    <p className="cta-description">
                        Join thousands of creators and bring your t-shirt ideas to life with our professional design tools
                    </p>
                    <div className="cta-buttons">
                        <button onClick={handleSignup} className="cta-button cta-button-primary">
                            <FaRocket className="button-icon" />
                            Get Started Free
                        </button>
                        <button onClick={handleLogin} className="cta-button cta-button-secondary">
                            <FaUsers className="button-icon" />
                            Login
                        </button>
                        <button onClick={handleDemoLogin} className="cta-button cta-button-demo">
                            <FaPalette className="button-icon" />
                            Try Demo
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default LandingPage;