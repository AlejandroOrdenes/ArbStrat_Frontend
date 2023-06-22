import Table from "react-bootstrap/Table";
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../cointegration/ListTrades.module.css";
import { useSelector } from "react-redux";
import Form from "react-bootstrap/Form";
import { BsPersonCircle } from "react-icons/bs";
import { ChartListTrades } from "./ChartListTrades";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button } from "react-bootstrap";


export const ListTrades = ({ onRowClick }) => {
  const [data, setData] = useState([]);
  const [zScoreData, setZScoreData] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const [currentPrices, setCurrentPrices] = useState({});
  const [image, setImage] = useState();
  const [userName, setUserName] = useState();
  const totalTrades = data.length * 2;
  const [selectedPair, setSelectedPair] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();



    const handleRowClick = async (pair) => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/cointegratedPair/${pair.idPair}`
        );
  
        onRowClick(response.data[0]);
        navigate("/cointegration");
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
  
      // onSelectPair(pair);
    };

  const winTrades = data.reduce((accum, trade) => {
    let winCount = 0;
    if (trade.profit1 > 0) {
      winCount++;
    }
    if (trade.profit2 > 0) {
      winCount++;
    }
    return accum + winCount;
  }, 0);

  const loseTrades = data.reduce((accum, trade) => {
    let loseCount = 0;
    if (trade.profit1 < 0) {
      loseCount++;
    }
    if (trade.profit2 < 0) {
      loseCount++;
    }
    return accum + loseCount;
  }, 0);

  useEffect(() => {
    // Supón que esta URL es donde tu backend expone los datos del usuario
    fetch("http://localhost:8000/currentUser", {
      method: "GET",
      headers: {
        // Supón que necesitas enviar un token de autenticación
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserName(data.username);
        setImage(data.image_profile);
        console.log(data.image_profile);
      })

      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const fetchCurrentPricesForAllPairs = async () => {
        // Obtiene los precios de todos los pares de monedas en data
        const pricePromises = data.map((trade) =>
          getCurrentPrices(trade.idPair)
        );
        await Promise.all(pricePromises);

        // Realiza cualquier otro cálculo o manipulación de los datos aquí

        console.log(
          "Precios y ganancias actualizados:",
          currentPrices
          // netProfits
        );
      };

      // Ejecuta fetchCurrentPricesForAllPairs al cargar inicialmente los datos
      fetchCurrentPricesForAllPairs();

      // Configura un intervalo para actualizar los precios cada N segundos (por ejemplo, 10 segundos)
      const updateInterval = setInterval(
        fetchCurrentPricesForAllPairs,
        10 * 6000
      );

      // Limpia el intervalo cuando el componente se desmonta o data cambia
      return () => clearInterval(updateInterval);
    }
  }, [data]);

  const fetchData = async () => {
    console.log("Ejecutando Busqueda pares!!");
    console.log(token);
    try {
      const response = await axios.get("http://127.0.0.1:8000/getClosedTrades/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Requested-With": "XMLHttpRequest",
        },
        withCredentials: true,
      });
      setData(response.data);
      console.log("DATA");
      console.log(response.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }

  };


  return (
    <div className={styles.pairsList}>
      <div className={styles.tableContainer}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Pairs Trades</h1>
        </div>
        <div className={styles.table}>
          <div className={styles.tableDataContainer}>
            <div className={styles.headTrades}>
              <h4>Trades</h4>
              <Button bsStyle="primary">Closed Trades</Button>
            </div>
            
            <div className={styles.dataTable}>
              <table class="table table-dark  table-hover">
                <thead className={styles.theadData}>
                  <tr>
                    <th>N°</th>
                    <th>Coin Name</th>
                    <th>Amount</th>
                    <th>Enter Price</th>
                    <th>Current Price</th>
                    <th>PN/L</th>
                    <th>Side</th>
                    <th>ZScore</th>

                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((tradeData, index) => {
                    const rowIndex = index + 1;

                    return [
                      <tr key={rowIndex} onClick={() => handleRowClick(tradeData)}>
                        <td>{rowIndex}</td>
                        <td>{tradeData.coin1}</td>
                        <td>${tradeData.amount1}</td>
                        <td>${tradeData.price1}</td>
                        <td>
                          ${currentPrices[tradeData.idPair]?.coin1 || "N/A"}
                        </td>
                        <td
                          style={{
                            color:
                              tradeData.profit1 > 0 ? "yellowgreen" : "red",
                          }}
                        >
                          ${tradeData.profit1}
                        </td>
                        <td>{tradeData.direction}</td>
                        <td>{tradeData.zScore}</td>
                        <td><a className={styles.closeButton} onClick={(e) =>{e.stopPropagation();  closeTrade(tradeData)}}>Close</a></td>
                      </tr>,
                      <tr onClick={() => handleRowClick(tradeData)}>
                        <td>{}</td>
                        <td>{tradeData.coin2}</td>
                        <td>${tradeData.amount2}</td>
                        <td>${tradeData.price2}</td>
                        <td>
                          ${currentPrices[tradeData.idPair]?.coin2 || "N/A"}
                        </td>
                        <td
                          style={{
                            color:
                              tradeData.profit2 > 0 ? "yellowgreen" : "red",
                          }}
                        >
                          ${tradeData.profit2}
                        </td>
                        <td>
                          {tradeData.direction === "long" ? "short" : "long"}
                        </td>
                        <td> </td>
                        <td></td>
                      </tr>,
                    ];
                  })}
                </tbody>

                {/* <tbody style={{ color: "white" }}>{renderTableRows()}</tbody> */}
              </table>
            </div>
          </div>

          <div className={styles.cardContainer}>
            <h3>{userName}</h3>
            <hr></hr>
            <div className={styles.infoTradesContainer}>
              <div className={styles.iconContainer}>
                {image ? (
                  <img
                    className={styles.profileImage}
                    src={`http://localhost:8000${image}`}
                    alt="Profile"
                  />
                ) : (
                  <BsPersonCircle className={styles.person} />
                )}
              </div>
              <div className={styles.tradesDetailsContainer}>
                <ul className={styles.ulTrade}>
                  <li className={styles.liTrade}>
                    <span className={styles.titleStyles}>Trades:</span>{" "}
                    {totalTrades}
                  </li>
                  <li className={styles.liTrade}>
                    <span className={styles.titleStyles}>Win:</span> {winTrades}
                  </li>
                  <li className={styles.liTrade}>
                    <span className={styles.titleStyles}>Lose:</span>{" "}
                    {loseTrades}
                  </li>
                </ul>
              </div>
            </div>
            <hr></hr>
            <div className={styles.chartContainer}>
              <ChartListTrades tradesData={data}></ChartListTrades>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

