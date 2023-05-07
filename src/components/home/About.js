import React from "react";
import { NavMenu } from "../home/NavMenu";
import styles from "./Home.module.css";

export const About = () => {
  return (
    <div className={styles.homeContainer}>
      <NavMenu />
      <div className={styles.homeTitle}>
        <h1 className={styles.strategy}>About</h1>
        <h1 className={styles.crypto}>CRYPTO ARBITRAGE</h1>
      </div>
    </div>
  );
};