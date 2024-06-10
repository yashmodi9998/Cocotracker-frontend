import { NavLink } from "react-router-dom";
export default function Header(){
    return(
        <header id="header">
        <nav className="navbar navbar-expand-lg container-fluid py-0">
          <a className="navbar-brand" href="/">
              NG CocoTracker
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav ms-auto mx-20">
              <NavLink className="nav-link" to="/">Home</NavLink>
              <NavLink className="nav-link" to="/register">Register</NavLink>
              <NavLink className="nav-link" to="/login">Log in</NavLink>
              <NavLink className="nav-link" to="/logout">Log out</NavLink>
            </div>  
          </div>
        </nav>
      </header>
    );
}