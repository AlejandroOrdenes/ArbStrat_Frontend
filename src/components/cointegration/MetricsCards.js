import React, {useState} from "react";
import styles from "../cointegration/MetricsCards.module.css"
import { ModalSimulation } from "../cointegration/ModalSimulation";

export const MetricsCards = ({ rowData, prices }) => {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const firstNonZeroValue = rowData.z_score.find((value) => value !== 0);
  return (
    <div class="row">
      {/* <div class="col mb-3 mb-sm-0">
        <div class="card" className={styles.card}>
          <div class="card-body" className={ styles.cards }>
            <h5 class="card-title">Z-Score</h5>
            <p class="card-text">
            {rowData.z_score[rowData.z_score.length - 1]}
            </p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card" className={styles.card}>
          <div class="card-body" className={ styles.cards }>
            <h5 class="card-title">Spread</h5>
            <p class="card-text">
            {rowData.Spread[rowData.Spread.length - 1]}
            </p>
          </div>
        </div>
      </div> */}
      <div class="col">
        <div class="card" className={styles.card}>
          <div class="card-body" className={ styles.cards }>
            <h5 class="card-title">Hedge Ratio</h5>
            <p class="card-text">
            {parseFloat(rowData.hedge_ratio).toFixed(4)}
            </p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card" className={styles.card}>
          <div class="card-body" className={ styles.cards }>
            <h5 class="card-title">Half Life</h5>
            
            <p class="card-text">
              {rowData.half_life}
            </p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card" className={styles.card}>
          <div class="card-body" className={ styles.cards }>
          <button
            type="button"
            className="btn btn-outline-info"
            onClick={() => setShowModal(true)}
          >
            Arbitrage Simulate
          </button>
          <ModalSimulation closeModal={closeModal} showModal={showModal} rowData={rowData} />
          </div>
        </div>
      </div>
    </div>
  );
};
