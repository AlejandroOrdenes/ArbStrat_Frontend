import React from "react";
import { NavMenu } from "../home/NavMenu";
import styles from "./Home.module.css";

export const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <NavMenu />
      <div className={styles.homeTitle}>
        <h1 className={styles.strategy}>STRATEGY & ANALYSIS</h1>
        <h1 className={styles.crypto}>CRYPTO ARBITRAGE</h1>
        <button className={styles.buttonStart}>START</button>
      </div>
    </div>
  );
};



