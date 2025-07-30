import { Link } from 'react-router-dom';

// Navbar from Bootstrap for main.tsx (formerly index)
export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">Movie Mania</Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/about">About</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/profiles">Profiles</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/movies">Movie Database</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/generator">Movie Generator</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/links">Links</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/contact">Contact</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
