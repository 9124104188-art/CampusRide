import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="landing">
      <div className="landing-content">
        <h1>Your Campus. Your Ride.</h1>
        <p>A safe and smart ride sharing platform for college students.</p>

        <div>
          <Link to="/login">
            <button>Login</button>
          </Link>

          <Link to="/register">
            <button className="secondary-btn">Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;