import PillNav from "./PillNav";
// import logo from "../assets/logo.svg";

function Navbar() {
  return (
    <PillNav
    //   logo={logo}
    //   logoAlt="Readify Logo"
      items={[
        { label: "Explore", href: "/explore" },
        { label: "My Shelf", href: "/shelf" },
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
  );
}

export default Navbar;