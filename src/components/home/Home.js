import React from "react";
import { NavMenu } from "../home/NavMenu";
import styles from "./Home.module.css";
import { NavLink } from "react-router-dom";

export const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <NavMenu />
      <div className={styles.homeTitle}>
        <h1 className={styles.strategy}>STRATEGY & ANALYSIS</h1>
        <h1 className={styles.crypto}>CRYPTO ARBITRAGE SIM</h1>
        <NavLink className={styles.linkButton} to="/login"><button className={styles.buttonStart}>START</button></NavLink> 
      </div>
    </div>
  );
};



