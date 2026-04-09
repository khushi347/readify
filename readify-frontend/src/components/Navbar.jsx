import PillNav from "./PillNav";
import "./Navbar.css";
import logo from "../assets/Readify.svg"; 

function Navbar() {
  return (
    <div className="navbar-container">
      <nav className="navbar">
      
    </nav>
      <PillNav
        items={[
          { label: "Explore", href: "/explore" },
          { label: "My Shelf", href: "/shelf" },
          { label: "Community", href: "/community" },
          { label: "Profile", href: "/profile" }
        ]}
        activeHref="/explore"
        className="custom-nav"
        ease="power2.easeOut"
        baseColor="#243F63"
        pillColor="#4F7C9B"
        hoveredPillTextColor="#FFFFFF"
        pillTextColor="#FFFFFF"
        theme="dark"
        initialLoadAnimation={false}
      />
    </div>
  );
}

export default Navbar;