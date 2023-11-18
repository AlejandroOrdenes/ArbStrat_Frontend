import React from "react";
import { NavMenu } from "../home/NavMenu";
import styles from "./Home.module.css";
import image from "../../assets/appImage.png";

export const About = () => {
  return (
    <div className={styles.homeContainer}>
      <NavMenu />
      <div className={styles.aboutContainer}>
        <div>
          <h1 className={styles.strategy}>About</h1>
          <h1 className={styles.crypto}>CRYPTO ARBITRAGE</h1>
          <div className={styles.textAbout}>
            <p>
              Welcome to ArbStrat, your gateway to the world of cryptocurrency
              arbitrage. Our state-of-the-art crypto arbitrage simulator
              leverages advanced asset cointegration strategies to help you
              understand the potential returns and risks involved in this
              exciting, yet complex, area of the cryptocurrency market.{" "}
              <br></br>
              <br></br>
              Join us and gain the edge in your crypto arbitrage trading
              journey.
              <br></br>
              <br></br>
              Contact us to arbstratcrypto@gmail.com
            </p>
          </div>
        </div>
        <div className={styles.imageContainer}>
          <img className={styles.image} src={image} alt="Description" />
        </div>
      </div>
      
    </div>
  );
};
