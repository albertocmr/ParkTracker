import React from "react";
import AuthWrapper from "./AuthWrapper.jsx";
import NavLinks from "./NavLinks.jsx";

const NavLinksWrapper = ({ currentPath }) => {
  return (
    <AuthWrapper>
      <NavLinks currentPath={currentPath} />
    </AuthWrapper>
  );
};

export default NavLinksWrapper;
