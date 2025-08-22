import { useState } from "react";
import { thunkLogin, thunkDemoLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(thunkLogin({ email, password }));
    if (response) setErrors(response);
    else closeModal();
  };

  // Demo login for modal
  const handleDemoLogin = async () => {
    const response = await dispatch(thunkDemoLogin());
    if (response && (response.error || response.errors)) {
      setErrors(response);
    } else {
      closeModal();
    }
  };


  return (
    <>
      <h1>Log In</h1>
      {errors.server && <p className="error-text">{errors.server}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email"
          />
        </label>
        {errors.email && <p className="error-text">{errors.email}</p>}
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
        {errors.password && <p>{errors.password}</p>}
        <button type="submit">Log In</button>
      </form>
      <button
        className="demo-btn"
        type="button"
        onClick={handleDemoLogin}
        aria-label=" Demo Login"
      >
        Demo User
      </button>

    </>
  );
}

export default LoginFormModal;
