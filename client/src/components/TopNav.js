import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../user-context";
import { Navbar, NavLink, Nav, NavItem } from "reactstrap";

const TopNav = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);
  const [rSelected, setRSelected] = useState(null);

  const logoutHandler = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    setIsLoggedIn(false);
  };

  return isLoggedIn ? (
    <div>
      <Navbar color="faded" light>
        <Nav>
          <NavItem>
            <NavLink href="/events">Events</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/">Dashboard</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/myregistrations">My Registrations</NavLink>
          </NavItem>
        </Nav>
        <NavLink href="/login" onClick={logoutHandler}>
          Logout
        </NavLink>
      </Navbar>
    </div>
  ) : (
    ""
  );
};

export default TopNav;
