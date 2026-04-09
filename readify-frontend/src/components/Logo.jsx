import { Link } from "react-router-dom";
import logo from "../assets/Readify.svg";
import "./Logo.css";

function Logo() {
  return (
    <div className="logo">
      <Link to="/explore">
        <img src={logo} alt="Readify Logo" />
      </Link>
    </div>
  );
}

export default Logo;