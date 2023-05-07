import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../cointegration/CointPairs.module.css";


export const CointPairs = ({ onRowClick }) => {
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);


  useEffect(() => {
    fetchData(); // Realizar la primera llamada al cargar el componente

    const interval = setInterval(() => {
      fetchData(); // Realizar la llamada periódica cada 1 minuto
    }, 60000);

    return () => {
      clearInterval(interval); // Limpiar el intervalo al desmontar el componente
    };
  }, []);


  const fetchData = async () => {
    console.log("Ejecutando Busqueda pares!!");
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/cointegratedPairs/"
      );
      setData(response.data);
      console.log("Tipo de dato de response.data:", typeof response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const formattedDate = `${date.getFullYear()}-${padZero(
      date.getMonth() + 1
    )}-${padZero(date.getDate())}`;
    const formattedTime = `${padZero(date.getHours())}:${padZero(
      date.getMinutes()
    )}:${padZero(date.getSeconds())}`;
    return `${formattedDate} ${formattedTime}`;
  };

  const padZero = (value) => {
    return value.toString().padStart(2, "0");
  };

  const renderTableRows = () => {
    // Convertir data en un objeto/array si es un string
    const parsedData = typeof data === "string" ? JSON.parse(data) : data;

    // Ordena los datos por fecha en orden descendente (más reciente primero)
    const sortedData = parsedData.sort(
      (a, b) => new Date(b.Date_detection) - new Date(a.Date_detection)
    );

    // Obtener la fecha actual y la fecha 1 día atrás
    const currentDate = new Date();
    const oneDayAgo = new Date();
    oneDayAgo.setDate(currentDate.getDate() - 1);

    // Filtrar las filas que están dentro del rango de fechas
    const filteredRows = sortedData.filter((row) => {
      const rowDate = new Date(row.Date_detection);
      return rowDate >= oneDayAgo && rowDate <= currentDate;
    });

    return filteredRows.map((row, index) => (
      <tr
        key={index}
        className={styles.rowHover}
        onClick={() => onRowClick(row)}
      >
        <th>{index + 1}</th>
        <th>{formatDateTime(row.Date_detection)}</th>
        <td>{row.Crypto1_ID}</td>
        <td>{row.Crypto2_ID}</td>
        <td>{row.Spread[row.Spread.length - 1]}</td>
      </tr>
    ));
  };

  return (
    <div className={styles.pairsList}>
      <div className={styles.tableContainer}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>ArbStrat Crypto</h1>
        </div>

        <div className={styles.table}>
          <h4>Cointegrated Pairs</h4>
          <div className={styles.dataTable}>
            <table class="table table-dark table-striped table-hover">
              <thead>
                <tr>
                  <th scope="col">N°</th>
                  <th scope="col">Date</th>
                  <th scope="col">Base Market</th>
                  <th scope="col">Quote Market</th>
                  <th scope="col">Spread</th>
                </tr>
              </thead>
              <tbody style={{ color: "white" }}>{renderTableRows()}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
