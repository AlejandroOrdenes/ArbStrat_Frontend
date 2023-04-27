import React from "react";
import styles from "../components/Footer.module.css"

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={ styles.Footer }>
      <div className={styles.footerContainer}>
        <div className={styles.footerCopyright}>
          <p>&copy; {currentYear} ArbStrat - All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
