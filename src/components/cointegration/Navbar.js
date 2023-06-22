import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "../cointegration/Navbar.module.css";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import {
  BsGrid1X2Fill,
  BsPersonCircle,
  BsGraphUp,
  BsBoxArrowLeft,
  BsKey
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onLogin, onLogout }) => {
  const token = useSelector((state) => state.auth.token);
  const [activeIcon, setActiveIcon] = useState(""); // Estado para mantener el icono activo
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchCurrentUser().then(user => {
      setCurrentUser(user);
    });
  }, []);

  async function fetchCurrentUser() {
    try {
      const response = await axios.get("http://127.0.0.1:8000/currentUser/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Requested-With": "XMLHttpRequest",
        },
        withCredentials: true,
      });

      return response.data
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  }

  useEffect(() => {
    // Obtener la ruta actual en la URL
    const currentPath = location.pathname;

    // Establecer el icono activo inicial según la ruta actual
    if (currentPath === "/cointegration") {
      setActiveIcon("cointegration");
    } else if (currentPath === "/trades") {
      setActiveIcon("trades");
    } else if (currentPath === "/profile") {
      setActiveIcon("profile");
    } else {
      setActiveIcon("logout");
    }
  }, [location.pathname]);

  // Función para manejar el clic en el icono
  const handleIconClick = (iconName) => {
    setActiveIcon(iconName);
  };



  return (
    <div className={styles.Navbar}>
      <ul className={styles.ulIcon}>
        <li
          className={`${styles.icon}${
            activeIcon === "cointegration" ? ` ${styles.active}` : ""
          }`}
          onClick={() => handleIconClick("cointegration")}
        >
          <NavLink to="/cointegration" activeClassName={styles.active}>
            <span className={styles.iconContainer}>
              <BsGrid1X2Fill
                color={
                  activeIcon === "cointegration"
                    ? "greenyellow"
                    : "rgb(158, 158, 158)"
                }
              />
            </span>
          </NavLink>
        </li>
        <li
          className={`${styles.icon}${
            activeIcon === "trades" ? ` ${styles.active}` : ""
          }`}
          onClick={() => handleIconClick("trades")}
        >
          <NavLink to="/trades" activeClassName={styles.active}>
            <span className={styles.iconContainer}>
              <BsGraphUp
                color={
                  activeIcon === "trades" ? "greenyellow" : "rgb(158, 158, 158)"
                }
              />
            </span>
          </NavLink>
        </li>
        <li
          className={`${styles.icon}${
            activeIcon === "profile" ? ` ${styles.active}` : ""
          }`}
          onClick={() => handleIconClick("profile")}
        >
          <NavLink to="/profile" activeClassName={styles.active}>
            <span className={styles.iconContainer}>
              <BsPersonCircle
                color={
                  activeIcon === "profile"
                    ? "greenyellow"
                    : "rgb(158, 158, 158)"
                }
              />
            </span>
          </NavLink>
        </li>
        <li
          className={`${styles.icon}${
            activeIcon === "logout" ? ` ${styles.active}` : ""
          }`}
          onClick={() => handleIconClick("logout")}
        >
          <NavLink to="/" onClick={onLogout} activeClassName={styles.active}>
            <span className={styles.iconContainer}>
              <BsBoxArrowLeft
                color={
                  activeIcon === "logout" ? "greenyellow" : "rgb(158, 158, 158)"
                }
              />
            </span>
          </NavLink>
        </li>
        {currentUser?.is_superuser && (
        <li
        className={`${styles.icon}${
          activeIcon === "admin" ? ` ${styles.active}` : ""
        }`}
        onClick={() => handleIconClick("admin")}
      >
        <a href="http://127.0.0.1:8000/admin/">
          <span className={styles.iconContainer}>
            <BsKey
              color={
                activeIcon === "admin" ? "greenyellow" : "rgb(158, 158, 158)"
              }
            />
          </span>
        </a>
      </li>
      )}
      </ul>
    </div>
  );
};

export default Navbar;
