import Table from "react-bootstrap/Table";
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../cointegration/ListTrades.module.css";
import { useSelector } from "react-redux";
import Form from "react-bootstrap/Form";
import { BsPersonCircle } from "react-icons/bs";
import { ChartListTrades } from "./ChartListTrades";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button } from "react-bootstrap";
import moment from "moment";

export const ListTrades = ({ onRowClick }) => {
  const [data, setData] = useState([]);
  const [dataHistorical, setDataHistorical] = useState([]);
  const [zScoreData, setZScoreData] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const [currentPrices, setCurrentPrices] = useState({});
  const [image, setImage] = useState();
  const [userName, setUserName] = useState();
  const totalTrades = data.length * 2;
  const totalHistorical = dataHistorical.length * 2;
  const [selectedPair, setSelectedPair] = useState(null);
  const [showHistorical, setShowHistorical] = useState(false);
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

  const totalWon = dataHistorical.reduce((accum, trade) => {
    let tradeProfit = 0;
    if (trade.profit1 > 0) {
      tradeProfit += parseFloat(trade.profit1);
    }
    if (trade.profit2 > 0) {
      tradeProfit += parseFloat(trade.profit2);
    }
    return accum + tradeProfit;
  }, 0);

  const winClosedTrades = dataHistorical.reduce((accum, trade) => {
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

  const totalLoss = dataHistorical.reduce((accum, trade) => {
    let tradeLoss = 0;
    if (trade.profit1 < 0) {
      tradeLoss += parseFloat(trade.profit1);
    }
    if (trade.profit2 < 0) {
      tradeLoss += parseFloat(trade.profit2);
    }
    return accum + tradeLoss;
  }, 0);

  // const loseClosedTrades = dataHistorical.reduce((accum, trade) => {
  //   let loseCount = 0;
  //   if (trade.profit1 < 0) {
  //     loseCount++;
  //   }
  //   if (trade.profit2 < 0) {
  //     loseCount++;
  //   }
  //   return accum + loseCount;
  // }, 0);

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
    try {
      const response = await axios.get("http://127.0.0.1:8000/getTrades/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Requested-With": "XMLHttpRequest",
        },
        withCredentials: true,
      });
      setData(response.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const getHistorical = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/getClosedTrades/",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Requested-With": "XMLHttpRequest",
          },
          withCredentials: true,
        }
      );
      setDataHistorical(response.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const getCurrentPrices = async (id) => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/currentPrices/" + id
      );
      setCurrentPrices((prevCurrentPrices) => ({
        ...prevCurrentPrices,
        [id]: {
          coin1: response.data.price1.toFixed(5),
          coin2: response.data.price2.toFixed(5),
        },
      }));
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const closeTrade = async (tradeData) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/saveCloseTrade/",
        {
          coin1: tradeData.coin1,
          amount1: tradeData.amount1,
          price1: tradeData.price1,
          profit1: tradeData.profit1,
          coin2: tradeData.coin2,
          amount2: tradeData.amount2,
          price2: tradeData.price2,
          profit2: tradeData.profit2,
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
      if (response.status === 200) {
        try {
          const response = await axios.post(
            "http://localhost:8000/closeTrade/",
            {
              id: tradeData.id,
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
          await fetchData();
        } catch (error) {
          console.error("Error sending data to backend:", error);
        }
      }
    } catch (error) {
      console.error("Error saving data to backend:", error);
    }
  };

  // const calculateNetProfits = () => {
  //   return data.map((trade) => {
  //     const isShort1 = trade.direction === "short";
  //     const isLong2 = !isShort1;

  //     const entryPrice1 = parseFloat(trade.price1);
  //     const entryPrice2 = parseFloat(trade.price2);
  //     const currentPrice1 = currentPrices[trade.idPair]?.coin1;
  //     const currentPrice2 = currentPrices[trade.idPair]?.coin2;
  //     const cantidad1 = parseFloat(trade.amount1);
  //     const cantidad2 = parseFloat(trade.amount2);

  //     const netProfit1 = currentPrice1
  //       ? isShort1
  //         ? cantidad1 * (1 - currentPrice1 / entryPrice1)
  //         : cantidad1 * (currentPrice1 / entryPrice1 - 1)
  //       : null;

  //     const netProfit2 = currentPrice2
  //       ? isLong2
  //         ? cantidad2 * (currentPrice2 / entryPrice2 - 1)
  //         : cantidad2 * (1 - currentPrice2 / entryPrice2)
  //       : null;

  //     return {
  //       id: trade.id,
  //       netProfit1: netProfit1 !== null ? netProfit1.toFixed(2) : "N/A",
  //       netProfit2: netProfit2 !== null ? netProfit2.toFixed(2) : "N/A",
  //       isProfit1: netProfit1 > 0,
  //       isProfit2: netProfit2 > 0,
  //     };
  //   });
  // };

  // const netProfits = calculateNetProfits();

  const handleHistoricalTrades = () => {
    try {
      getHistorical();
    } catch (error) {
      console.error(error);
    }

    if (showHistorical) {
      setShowHistorical(false);
    } else {
      setShowHistorical(true);
    }
  };

  const formattedDate = (dateString) => {
    const date = new Date(dateString);
    const formatted = date
      .toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/(\d+)\/(\d+)\/(\d+)/, "$2-$1-$3");
    return formatted;
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
              {showHistorical ? (
                <>
                  <h4>Historical Trades</h4>
                  <Button onClick={handleHistoricalTrades} bsStyle="primary">
                    Trades
                  </Button>
                </>
              ) : (
                <>
                  <h4>Trades</h4>
                  <Button onClick={handleHistoricalTrades} bsStyle="primary">
                    Historical Trades
                  </Button>
                </>
              )}
            </div>

            <div className={styles.dataTable}>
              {showHistorical ? (
                <table class="table table-dark  table-hover">
                  <thead className={styles.theadData}>
                    <tr>
                      <th>N°</th>
                      <th>Coin Name</th>
                      <th>Amount</th>
                      <th>Close Price</th>
                      <th>Win/Lose</th>
                      <th>Close Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataHistorical
                      .sort(
                        (a, b) =>
                          new Date(b.close_timestamp) -
                          new Date(a.close_timestamp)
                      )
                      .map((tradeData, index) => {
                        const rowIndex = index + 1;

                        return [
                          <tr key={rowIndex}>
                            <td>{rowIndex}</td>
                            <td>{tradeData.coin1}</td>
                            <td>${parseFloat(tradeData.amount1).toFixed(2)}</td>
                            <td>${parseFloat(tradeData.price1).toFixed(2)}</td>
                            <td
                              style={{
                                color:
                                  parseFloat(tradeData.profit1).toFixed(2) > 0
                                    ? "yellowgreen"
                                    : "red",
                              }}
                            >
                              ${parseFloat(tradeData.profit1).toFixed(2)}
                            </td>
                            <td>{formattedDate(tradeData.close_timestamp)}</td>
                          </tr>,
                          <tr>
                            <td>{}</td>
                            <td>{tradeData.coin2}</td>
                            <td>${parseFloat(tradeData.amount2).toFixed(2)}</td>
                            <td>${parseFloat(tradeData.price2).toFixed(2)}</td>
                            <td
                              style={{
                                color:
                                  parseFloat(tradeData.profit2).toFixed(2) > 0
                                    ? "yellowgreen"
                                    : "red",
                              }}
                            >
                              ${parseFloat(tradeData.profit2).toFixed(2)}
                            </td>
                            <td></td>
                          </tr>,
                        ];
                      })}
                  </tbody>
                </table>
              ) : (
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
                        <tr
                          key={rowIndex}
                          onClick={() => handleRowClick(tradeData)}
                        >
                          <td>{rowIndex}</td>
                          <td>{tradeData.coin1}</td>
                          <td>${tradeData.amount1}</td>
                          <td>${tradeData.price1}</td>
                          <td>
                            {currentPrices[tradeData.idPair]?.coin1
                              ? `$${parseFloat(
                                  currentPrices[tradeData.idPair]?.coin1
                                ).toFixed(2)}`
                              : "N/A"}
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
                          <td>
                            <a
                              className={styles.closeButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                closeTrade(tradeData);
                              }}
                            >
                              Close
                            </a>
                          </td>
                        </tr>,
                        <tr onClick={() => handleRowClick(tradeData)}>
                          <td>{}</td>
                          <td>{tradeData.coin2}</td>
                          <td>${tradeData.amount2}</td>
                          <td>${tradeData.price2}</td>
                          <td>
                            {currentPrices[tradeData.idPair]?.coin2
                              ? `$${parseFloat(
                                  currentPrices[tradeData.idPair]?.coin2
                                ).toFixed(2)}`
                              : "N/A"}
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
                </table>
              )}
            </div>
          </div>

          <div className={styles.cardContainer}>
            <h3>{userName}</h3>
            <hr></hr>
            <div className={styles.infoTradesContainer}>
              {showHistorical ? null : (
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
              )}
              <div className={styles.tradesDetailsContainer}>
                <ul className={styles.ulTrade}>
                  <li className={styles.liTrade}>
                    {showHistorical ? (
                      <span className={styles.titleStyles}>
                        Trades: {totalHistorical}{" "}
                      </span>
                    ) : (
                      <span className={styles.titleStyles}>
                        Trades: {totalTrades}{" "}
                      </span>
                    )}
                  </li>
                  <li className={styles.liTrade}>
                    {showHistorical ? null : (
                      <span className={styles.titleStyles}>
                        Win: {winTrades}
                      </span>
                    )}
                  </li>
                  <li className={styles.liTrade}>
                    {showHistorical ? (
                      <span className={styles.titleStyles}>
                        Won: ${totalWon.toFixed(2)}
                      </span>
                    ) : null}
                  </li>
                  <li className={styles.liTrade}>
                    {showHistorical ? null : (
                      <span className={styles.titleStyles}>
                        Lose: {loseTrades}
                      </span>
                    )}
                  </li>
                  <li className={styles.liTrade}>
                    {showHistorical ? (
                      <span className={styles.titleStyles}>
                        Loss: ${totalLoss.toFixed(2)}
                      </span>
                    ) : null}
                  </li>
                  <li className={styles.liTrade}>
                    {showHistorical ? (
                      <span className={styles.titleStyles}>
                        Profit: ${(totalWon + totalLoss).toFixed(2)}
                      </span>
                    ) : null}
                  </li>
                </ul>
              </div>
            </div>
            <hr></hr>
            <div className={styles.chartContainer}>
              {showHistorical ? (
                <ChartListTrades tradesData={dataHistorical}></ChartListTrades>
              ) : (
                <ChartListTrades tradesData={data}></ChartListTrades>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// direction: direction,
//           coin1: rowData.Crypto1_ID,
//           coin2: rowData.Crypto2_ID,
//           price1: rowData.last_price_1,
//           price2: rowData.last_price_2,
//           amount1: value1,
//           amount2: value2,
