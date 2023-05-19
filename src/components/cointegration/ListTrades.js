import Table from "react-bootstrap/Table";
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../cointegration/ListTrades.module.css";
import { useSelector } from "react-redux";
import Form from "react-bootstrap/Form";
import { BsPersonCircle } from "react-icons/bs";

export const ListTrades = () => {
  const [data, setData] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const [indexTrade, setIndexTrade] = useState(0);
  const [currentPrices, setCurrentPrices] = useState({});
  const [image, setImage] = useState();
  const [userName, setUserName] = useState();

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
      // Define una función para obtener los precios de todos los pares de monedas en data
      const fetchCurrentPricesForAllPairs = () => {
        data.forEach((trade) => {
          getCurrentPrices(trade.idPair);
        });
      };

      // Obtiene los precios iniciales
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
      const response = await axios.get("http://127.0.0.1:8000/getTrades/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Requested-With": "XMLHttpRequest",
        },
        withCredentials: true,
      });
      setData(response.data);
      console.log("Tipo de dato de response.data:", typeof response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const getCurrentPrices = async (idPair) => {
    console.log("Ejecutando búsqueda de precios!!");
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/currentPrices/" + idPair
      );
      setCurrentPrices((prevCurrentPrices) => ({
        ...prevCurrentPrices,
        [idPair]: {
          coin1: response.data.price1,
          coin2: response.data.price2,
        },
      }));
      console.log(currentPrices);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const getUserData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/getUserData/");
      setImage(response.data);
      setUserName(response.data);
      console.log(image);
    } catch (error) {
      console.error("Error al cargar userImage:", error);
    }
  };

  const calculateNetProfits = () => {
    return data.map((trade) => {
      const isLong = trade.side === "long"; // Asume que hay una propiedad "type" en el objeto "trade"
      const entryPrice1 = trade.price1;
      const entryPrice2 = trade.price2;
      const currentPrice1 = currentPrices[trade.idPair]?.coin1;
      const currentPrice2 = currentPrices[trade.idPair]?.coin2;

      const netProfit1 = currentPrice1
        ? isLong
          ? currentPrice1 - entryPrice1
          : entryPrice1 - currentPrice1
        : "N/A";
      const netProfit2 = currentPrice2
        ? isLong
          ? currentPrice2 - entryPrice2
          : entryPrice2 - currentPrice2
        : "N/A";

      return {
        idPair: trade.idPair,
        netProfit1: netProfit1 !== "N/A" ? netProfit1.toFixed(2) : "N/A",
        netProfit2: netProfit2 !== "N/A" ? netProfit2.toFixed(2) : "N/A",
        isProfit1: netProfit1 > 0,
        isProfit2: netProfit2 > 0,
      };
    });
  };

  const netProfits = calculateNetProfits();

  return (
    <div className={styles.pairsList}>
      <div className={styles.tableContainer}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Pairs Trades</h1>
        </div>
        <div className={styles.table}>
          <div className={styles.dataTable}>
            <h4>Trades</h4>
            <table class="table table-dark  table-hover">
              <thead>
                <tr>
                  <th scope="col">N°</th>
                  <th scope="col">Coin Name</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Enter Price</th>
                  <th scope="col">Current Price</th>
                  <th scope="col">N/L</th>
                  <th scope="col">Side</th>
                  <th scope="col">Delete</th>
                </tr>
              </thead>
              <tbody>
                {data.map((data, index) => {
                  const rowIndex = index * 2;
                  // Encuentra los resultados de la ganancia neta correspondientes a la fila actual
                  const tradeNetProfits = netProfits.find(
                    (profit) => profit.idPair === data.idPair
                  );

                  return [
                    <tr key={rowIndex}>
                      <td>{rowIndex + 1}</td>
                      <td>{data.coin1}</td>
                      <td>${data.amount1}</td>
                      <td>${data.price1}</td>
                      <td>${currentPrices[data.idPair]?.coin1 || "N/A"}</td>
                      <td
                        style={{
                          color: tradeNetProfits.isProfit1
                            ? "yellowgreen"
                            : "red",
                        }}
                      >
                        {tradeNetProfits.netProfit1}
                      </td>
                      <td>{data.direction}</td>
                      <td>Delete</td>
                    </tr>,
                    <tr key={rowIndex + 1}>
                      <td>{rowIndex + 2}</td>
                      <td>{data.coin2}</td>
                      <td>${data.amount2}</td>
                      <td>${data.price2}</td>
                      <td>${currentPrices[data.idPair]?.coin2 || "N/A"}</td>
                      <td
                        style={{
                          color: tradeNetProfits.isProfit2
                            ? "yellowgreen"
                            : "red",
                        }}
                      >
                        {tradeNetProfits.netProfit2}
                      </td>
                      <td>
                        {data.direction === "long"
                          ? "short"
                          : "long" && data.direction === "short"
                          ? "long"
                          : "short"}
                      </td>
                      <td>Delete</td>
                    </tr>,
                  ];
                })}
              </tbody>

              {/* <tbody style={{ color: "white" }}>{renderTableRows()}</tbody> */}
            </table>
          </div>
          <div className={styles.cardContainer}>
            <h3>{userName}</h3>
            <hr></hr>
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
            <Form className={styles.changeDataForm}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="{email}" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicUserName">
                <Form.Label>UserName</Form.Label>
                <Form.Control type="text" placeholder="{name}" />
              </Form.Group>

              <button className={styles.button} variant="primary" type="submit">
                Save Changes
              </button>
            </Form>
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
