// presentational component for the landing page
import PropTypes from 'prop-types';

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

function LandingPage({ onLoginClick, onSignupClick, onDemoClick }) {
    return (
        <div className="landing-root">
            <header className="Landing-header">
                <h1>That&apos;s A Tshirt</h1>
                <p className="tagline"> Create. Share. Wear. Social T-shirt design for everyone.</p>
            </header>
            <section className="hero-section">
                <img
                    src="/images/hero-image.png"
                    alt="Hero" className="hero-image"
                />
            </section>
            <section className="landing-description">
                <p>
                    Design your own custom tees, share with friends and discover the latest trends- all in one easy-to-use platform.
                </p>
            </section>

            <section className="cta-buttons">
                <button className="cta-button-login" onClick={onLoginClick}>Log in</button>
                <button className="cta-button-signup" onClick={onSignupClick}>Sign Up</button>
                <button
                    className="cta-button-demo"
                    onClick={onDemoClick}
                    aria-label="Try DemoUser"
                >
                    Demo User</button>
            </section>
        </div >
    );
}

LandingPage.propTypes = {
    onLoginClick: PropTypes.func.isRequired,
    onSignupClick: PropTypes.func.isRequired,
    onDemoClick: PropTypes.func.isRequired
};

LandingPage.defaultProps = {
    onLoginClick: () => { },
    onSignupClick: () => { },
    onDemoClick: () => { }
};

export default LandingPage;
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