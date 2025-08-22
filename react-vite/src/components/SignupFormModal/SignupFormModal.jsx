import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";

/** 
 * SignupFormModal
 * 
 *Modal version for quick, non-routing signup flow 
 * uses modalcontext to close modal after successful signup
 * 
 
 */


function SignupFormModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  // controlled inputs state
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        username,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();// ju close modal on success
    }
  };

  return (
    <>
      <h1>Sign Up</h1>
      {errors.server && <p className="error-text">{errors.server}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email"
          />
        </label>
        {errors.email && <p className="error-text">{errors.email}</p>}
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            aria-label="Username"
          />
        </label>
        {errors.username && <p className="error-text">{errors.username}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Password"
          />
        </label>
        {errors.password && <p className="error-text">{errors.password}</p>}
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            aria-label="Confirm Password"
          />
        </label>
        {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
        <button type="submit">Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;
