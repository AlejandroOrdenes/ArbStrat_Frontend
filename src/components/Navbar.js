import React from "react";
import styles from '../components/Navbar.module.css'
import { BsGrid1X2Fill, BsPersonCircle, BsGraphUp, BsBoxArrowLeft } from "react-icons/bs";



export const Navbar = () => {
  return (
    <div className={styles.Navbar}>
        <ul>
            <li className="icon"><BsGrid1X2Fill/></li>
            <li className="icon"><BsGraphUp/></li>
            <li className="icon"><BsPersonCircle/></li>
            <li className="icon"><BsBoxArrowLeft/></li>
        </ul>
    </div>
  );
};

export default Navbar;
