import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import styles from "../cointegration/ModalSimulation.module.css";
import axios from "axios";



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
  // const csrfToken = getCookie("csrftoken");p

  const getCsrfToken = async () => {
    try {
      const response = await axios.get("http://localhost:8000/csrf/");
      const csrfToken = response.data.csrfToken;
      console.log(csrfToken);
      return csrfToken;
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
      return "";
    }
  };

  const handleLongClick = () => {
    setLongActive(true);
    setShortActive(false);
    setDirection('long')
  };

  const handleShortClick = () => {
    setShortActive(true);
    setLongActive(false);
    setDirection('short')
  };

  // function getCookie(name) {
  //   let cookieValue = null;
  //   if (document.cookie && document.cookie !== '') {
  //     const cookies = document.cookie.split(';');
  //     for (let i = 0; i < cookies.length; i++) {
  //       const cookie = cookies[i].trim();
  //       if (cookie.substring(0, name.length + 1) === (name + '=')) {
  //         cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
  //         break;
  //       }
  //     }
  //   }
  //   return cookieValue;
  // }

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
    setLongActive(false)
    setShortActive(false)
    closeModal();
  };

  const handlePlaceTradesClick = async () => {
    const csrfToken = await getCsrfToken();
    console.log("CSRF Token:", csrfToken);

    try {
      const response = await axios.post(
        "http://localhost:8000/simulateTrades/",
        {
          direction: direction,
          price1: price1,
          price2: price2,
          amount1: value1,
          amount2: value2,
          zscore: rowData.z_score[rowData.z_score.length - 1],
          spread: rowData.Spread[rowData.Spread.length - 1],
          hedgeRatio: parseFloat(rowData.hedge_ratio).toFixed(4)
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken, // Include the CSRF token
            "X-Requested-With": "XMLHttpRequest",
          },
          withCredentials: true,
        }
      );
      console.log("Enviado trades....");

      // Handle the response from your Django backend
      console.log(response.data);
    } catch (error) {
      console.error("Error sending data to backend:", error);
    }
  };

  return (
    <Modal
      show={showModal}
      onHide={handleCloseModal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
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
        <div className={styles.directionContainer}>
          <button
            className={`${styles.longButton} ${
              isLongActive ? styles.active : ""
            }`}
            onClick={handleLongClick}
          >
            Long
          </button>
          <button
            className={`${styles.shortButton} ${
              isShortActive ? styles.active : ""
            }`}
            onClick={handleShortClick}
          >
            Short
          </button>
        </div>
      </Modal.Body>
      <Modal.Footer className={styles.modalFooter}>
        <Button onClick={handlePlaceTradesClick} className={styles.placeTrade}>
          Place Trades
        </Button>
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
