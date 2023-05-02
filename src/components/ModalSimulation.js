import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import styles from "../components/ModalSimulation.module.css";

export const ModalSimulation = ({
  closeModal,
  showModal,
  rowData,
  lastPrice,
}) => {
  const [price1, setPrice1] = useState("");
  const [price2, setPrice2] = useState("");
  const [quantity1, setQuantity1] = useState(null);
  const [quantity2, setQuantity2] = useState(null);
  console.log(rowData.last_price_1)
  console.log(rowData.last_price_2)

  const calculateQuantity = (value, cryptoId) => {
    if (cryptoId === rowData.Crypto1_ID) {
      const quantity = value / rowData.last_price_1;
      setQuantity1(quantity);
    } else if (cryptoId === rowData.Crypto2_ID) {
      const quantity = value / rowData.last_price_2;
      setQuantity2(quantity);
    }
  };

  const handlePriceChange = (event, cryptoId) => {
    const inputValue = event.target.value;
  
    if (cryptoId === rowData.Crypto1_ID) {
      setPrice1(inputValue);
      if (inputValue === "") {
        setPrice2("");
        setQuantity1(null);
        setQuantity2(null);
      } else {
        calculateQuantity(inputValue, cryptoId);
        // Calcular el valor del segundo input según el hedge ratio
        const price2Value = parseFloat(inputValue) * parseFloat(rowData.hedge_ratio);
        setPrice2(price2Value.toFixed(4));
        calculateQuantity(price2Value, rowData.Crypto2_ID);
      }
    } else if (cryptoId === rowData.Crypto2_ID) {
      setPrice2(inputValue);
      calculateQuantity(inputValue, cryptoId);
    }
  };
  

  const handleCloseModal = () => {
    setPrice1("");
    setPrice2("");
    setQuantity1(null);
    setQuantity2(null);
    closeModal();
  };
  return (
    <Modal
      show={showModal}
      onHide={handleCloseModal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Arbitrage Simulate
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Coins</h4>
        <div className={styles.coinsContainer}>
          <div>
            <h5>{rowData.Crypto1_ID}</h5>
            <span>${rowData.last_price_1}</span>
          </div>
          <div>
            <h5>{rowData.Crypto2_ID}</h5>
            <p>${rowData.last_price_2}</p>
          </div>
        </div>
        <hr></hr>
        <div class="row">
          <div class="col mb-3 mb-sm-0">
            <div class="card" className={styles.card}>
              <div class="card-body" className={styles.cards}>
                <h5 class="card-title">Z-Score</h5>
                <p class="card-text">
                  {rowData.z_score[rowData.z_score.length - 1]}
                </p>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="card" className={styles.card}>
              <div class="card-body" className={styles.cards}>
                <h5 class="card-title">Spread</h5>
                <p class="card-text">
                  {rowData.Spread[rowData.Spread.length - 1]}
                </p>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="card" className={styles.card}>
              <div class="card-body" className={styles.cards}>
                <h5 class="card-title">Hedge Ratio</h5>
                <p class="card-text">
                  {parseFloat(rowData.hedge_ratio).toFixed(4)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <hr></hr>
        <h4>Trade Size</h4>
        <div className={styles.tradeContainer}>
          <div>
            <h5>{rowData.Crypto1_ID}</h5>
            <input
              type="number"
              value={price1}
              onChange={(event) => handlePriceChange(event, rowData.Crypto1_ID)}
              placeholder="USD"
            />
            <p>
              {rowData.Crypto1_ID}:{" "}
              {typeof quantity1 === "number" ? quantity1.toFixed(8) : "-"}
            </p>
          </div>
          <div>
            <h5>{rowData.Crypto2_ID}</h5>
            <input
              type="number"
              value={price2}
              onChange={(event) => handlePriceChange(event, rowData.Crypto2_ID)}
              placeholder="USD"
            />
            <p>
              {rowData.Crypto2_ID}:{" "}
              {typeof quantity2 === "number" ? quantity2.toFixed(8) : "-"}
            </p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className={styles.placeTrade}>Place Trades</Button>
      </Modal.Footer>
    </Modal>
  );
};

function App() {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        Launch vertically centered modal
      </Button>

      <ModalSimulation
        showModal={modalShow}
        closeModal={() => setModalShow(false)}
      />
    </>
  );
}

export default App;
