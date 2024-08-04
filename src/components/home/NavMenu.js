import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import styles from "./NavMenu.module.css";

export const NavMenu = () => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <NavLink to="/">
            <Navbar.Brand>ArbStrat </Navbar.Brand>
        </NavLink>
        
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className={styles.menuContainer}>
                <NavLink to='/about'>About</NavLink>
                <NavLink to='/signup'>SignUp</NavLink>
                <NavLink to="/login">LogIn</NavLink>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}