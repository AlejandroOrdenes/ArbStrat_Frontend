import Table from "react-bootstrap/Table";
import React from "react";
import styles from '../cointegration/ListTrades.module.css'


export const Profile = () => {
    return (
        <div className={styles.pairsList}>
          <div className={styles.tableContainer}>
            <div className={styles.titleContainer}>
              <h1 className={styles.title}>Profile</h1>
            </div>
    
            <div className={styles.table}>
              <h4>Trades</h4>
              <div className={styles.dataTable}>
                <table class="table table-dark table-striped table-hover">
                  <thead>
                    <tr>
                    <th scope="col">N°</th>
                      <th scope="col">Coin Name</th>
                      <th scope="col">Enter Price</th>
                      <th scope="col">Current Price</th>
                      <th scope="col">N/L</th>
                      <th scope="col">Side</th>
                      <th scope="col">Delete</th>
                    </tr>
                  </thead>
                  {/* <tbody style={{ color: "white" }}>{renderTableRows()}</tbody> */}
                </table>
              </div>
            </div>
          </div>
        </div>
      );
};