import React from "react";
import styles from "../components/MetricsCards.module.css"

export const MetricsCards = ({ rowData }) => {
  return (
    <div class="row">
      <div class="col-sm-3 mb-3 mb-sm-0">
        <div class="card" className={styles.card}>
          <div class="card-body" className={ styles.cards }>
            <h5 class="card-title">Z-Score</h5>
            <p class="card-text">
            {parseFloat(rowData.z_score).toFixed(4)}
            </p>
          </div>
        </div>
      </div>
      <div class="col-sm-3">
        <div class="card" className={styles.card}>
          <div class="card-body" className={ styles.cards }>
            <h5 class="card-title">Spread</h5>
            <p class="card-text">
            {parseFloat(rowData.Spread).toFixed(4)}
            </p>
          </div>
        </div>
      </div>
      <div class="col-sm-3">
        <div class="card" className={styles.card}>
          <div class="card-body" className={ styles.cards }>
            <h5 class="card-title">Hedge Ratio</h5>
            <p class="card-text">
            {parseFloat(rowData.hedge_ratio).toFixed(4)}
            </p>
          </div>
        </div>
      </div>
      <div class="col-sm-3">
        <div class="card" className={styles.card}>
          <div class="card-body" className={ styles.cards }>
            <h5 class="card-title">Half Life</h5>
            
            <p class="card-text">
              {rowData.half_life}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
