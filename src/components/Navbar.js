import React, { useState } from "react";
import styles from "../components/Navbar.module.css";
import { NavLink } from "react-router-dom";
import { BsGrid1X2Fill, BsPersonCircle, BsGraphUp, BsBoxArrowLeft } from "react-icons/bs";

export const Navbar = () => {
  const [activeIcon, setActiveIcon] = useState(""); // Estado para mantener el icono activo
  console.log(activeIcon)
  // Función para manejar el clic en el icono
  const handleIconClick = (iconName) => {
    setActiveIcon(iconName);
  };

  return (
    <div className={styles.Navbar}>
      <ul>
        <li
          className={`${styles.icon}${activeIcon === "cointegration" ? ` ${styles.active}` : ""}`}
          onClick={() => handleIconClick("cointegration")}
        >
          <NavLink to="/cointegration" activeClassName={styles.active}>
            <span className={styles.iconContainer}>
              <BsGrid1X2Fill />
            </span>
          </NavLink>
        </li>
        <li
          className={`${styles.icon}${activeIcon === "trades" ? ` ${styles.active}` : ""}`}
          onClick={() => handleIconClick("trades")}
        >
          <NavLink to="/trades" activeClassName={styles.active}>
            <span className={styles.iconContainer}>
              <BsGraphUp />
            </span>
          </NavLink>
        </li>
        <li
          className={`${styles.icon}${activeIcon === "profile" ? ` ${styles.active}` : ""}`}
          onClick={() => handleIconClick("profile")}
        >
          <NavLink to="/profile" activeClassName={styles.active}>
            <span className={styles.iconContainer}>
              <BsPersonCircle />
            </span>
          </NavLink>
        </li>
        <li
          className={`${styles.icon}${activeIcon === "logout" ? ` ${styles.active}` : ""}`}
          onClick={() => handleIconClick("logout")}
        >
          <NavLink to="/logout" activeClassName={styles.active}>
            <span className={styles.iconContainer}>
              <BsBoxArrowLeft />
            </span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;





