import { useState } from "react";
import { thunkDemoLogin, thunkLogin } from "../../redux/session";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginFormPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    e.preventDefault();
    const response = await dispatch(thunkLogin({ email, password }));
    if (response) setErrors(response);
    else navigate("/");
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
    <>
      <h1>Log In</h1>
      {/*  Display Server error  */}
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

export default LoginFormPage;
