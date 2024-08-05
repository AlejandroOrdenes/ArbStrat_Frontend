import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button } from "react-bootstrap";
import styles from "../cointegration/ModalSimulation.module.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { Toast } from "react-bootstrap";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/react";

export const ModalSimulation = ({ closeModal, showModal, rowData }) => {
  const [price1, setPrice1] = useState("");
  const [price2, setPrice2] = useState("");
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [quantity1, setQuantity1] = useState(null);
  const [quantity2, setQuantity2] = useState(null);
  const [isLongActive, setLongActive] = useState(false);
  const [isShortActive, setShortActive] = useState(false);
  const [direction, setDirection] = useState("");
  const token = useSelector((state) => state.auth.token);
  const [showToast, setShowToast] = useState(false);
  const [toastHeader, setToastHeader] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hideToast = useCallback(() => {
    setShowToast(false);
  });

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        hideToast();
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [showToast, hideToast, useCallback]);

  const handleLongClick = () => {
    setLongActive(true);
    setShortActive(false);
    setDirection("long");
  };

  const handleShortClick = () => {
    setShortActive(true);
    setLongActive(false);
    setDirection("short");
  };

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
      setValue1(inputValue);
      if (inputValue === "") {
        setPrice2("");
        setQuantity1(null);
        setQuantity2(null);
      } else {
        calculateQuantity(inputValue, cryptoId);
        // Calcular el valor del segundo input según el hedge ratio
        const price2Value =
          parseFloat(inputValue) * parseFloat(rowData.hedge_ratio);
        setPrice2(price2Value.toFixed(4));
        calculateQuantity(price2Value, rowData.Crypto2_ID);
        setValue2(price2Value);
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
    setLongActive(false);
    setShortActive(false);
    setDirection("");
    closeModal();
  };

  const handlePlaceTradesClick = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "https://arbstrat.aordenes.com/api/simulateTrades/",
        {
          idPair: rowData.id,
          direction: direction,
          coin1: rowData.Crypto1_ID,
          coin2: rowData.Crypto2_ID,
          price1: rowData.last_price_1,
          price2: rowData.last_price_2,
          amount1: value1,
          amount2: value2,
          zscore: rowData.z_score[rowData.z_score.length - 1],
          spread: rowData.Spread[rowData.Spread.length - 1],
          hedgeRatio: parseFloat(rowData.hedge_ratio).toFixed(4),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Requested-With": "XMLHttpRequest",
          },
          withCredentials: true,
        }
      );
      setShowToast(true);
      setToastColor("yellowgreen");
      setToastHeader("Trade OK");
      setToastMessage("Placed Trade Correct!!");
    } catch (error) {
      setShowToast(true);
      setToastColor("#ff4a4a");
      setToastHeader("Trade Fail!");
      setToastMessage("Error to placed Trade!!");
      console.error("Error sending data to backend:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const spinnerStyle = css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1050;
  `;

  return (
    <>
      <Modal
        className={styles.modalComplete}
        show={showModal}
        onHide={handleCloseModal}
        size="lg"
        aria-labelledby="contained-modal-title-vtop"
        centered
      >
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          style={{
            position: "fixed",
            top: "20%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            opacity: 1, // Agregar esta línea para eliminar la opacidad
            backgroundColor: toastColor,
            color: "white",

            // Cambiar el color de fondo del header
          }}
        >
          
          <Toast.Header>
            <strong className="mr-auto">{toastHeader}</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
        <Modal.Header closeButton className={styles.modalHead}>
          <Modal.Title id="contained-modal-title-vcenter">
            Arbitrage Simulate
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modalBody}>
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
                    {rowData.z_score[rowData.z_score.length - 1].toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="card" className={styles.card}>
                <div class="card-body" className={styles.cards}>
                  <h5 class="card-title">Spread</h5>
                  <p class="card-text">
                    {rowData.Spread[rowData.Spread.length - 1].toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="card" className={styles.card}>
                <div class="card-body" className={styles.cards}>
                  <h5 class="card-title">Hedge Ratio</h5>
                  <p class="card-text">
                    {parseFloat(rowData.hedge_ratio).toFixed(2)}
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
                className={styles.tradesInput}
                type="number"
                value={price1}
                onChange={(event) =>
                  handlePriceChange(event, rowData.Crypto1_ID)
                }
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
                className={styles.tradesInput}
                type="number"
                value={price2}
                onChange={(event) =>
                  handlePriceChange(event, rowData.Crypto2_ID)
                }
                placeholder="USD"
              />
              <p>
                {rowData.Crypto2_ID}:{" "}
                {typeof quantity2 === "number" ? quantity2.toFixed(8) : "-"}
              </p>
            </div>
          </div>
          <div className={styles.directionContainer}>
            <button
              className={`${styles.longButton} ${
                isLongActive ? styles.active : ""
              }`}
              onClick={handleLongClick}
              disabled={isSubmitting}
            >
              Long
            </button>
            <button
              className={`${styles.shortButton} ${
                isShortActive ? styles.active : ""
              }`}
              onClick={handleShortClick}
              disabled={isSubmitting}
            >
              Short
            </button>
          </div>
        </Modal.Body>
        <Modal.Footer className={styles.modalFooter}>
          
          <Button
            onClick={handlePlaceTradesClick}
            className={styles.placeTrade}
            disabled={!price1 || !price2 || !direction || isSubmitting}
          >
            Place Trades
          </Button>
        </Modal.Footer>
      </Modal>
    </>
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
