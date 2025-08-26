import { NavLink, Link } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import { useSelector } from "react-redux";




function Navigation() {
  const currentUser = useSelector(state => state.session.user);

  return (
    <ul>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>

      <li>
        <Link to="/design/new">
          <button className="navbar-button">Create Design</button>
        </Link>
      </li>
      <li>
        <Link to="/designs/new">
          <button className="navbar-button">My Designs</button>
        </Link>
      </li>
      {currentUser && (
        <li>
          <Link to={`/users/${currentUser.id}/posts`}>
            <button className="navbar-button">My Posts</button>
          </Link>
        </li>
      )}
      <li>
        <Link to={`/posts`}>
          <button className="navbar-button">All Posts</button>
        </Link>
      </li>


      <li>
        <ProfileButton />
      </li>
    </ul>
  );
}

export default Navigation;
