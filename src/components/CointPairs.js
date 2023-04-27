import React, {useState, useEffect} from "react";
import axios from "axios";
import styles from "../components/CointPairs.module.css";

export const CointPairs = ({ onRowClick }) => {

  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/cointegratedPairs/");
      setData(response.data);
      console.log(response.data)
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);
  };

  const renderTableRows = () => {
    // Ordena los datos por fecha en orden descendente (más reciente primero)
  const sortedData = data.sort((a, b) => new Date(b.Date_detection) - new Date(a.Date_detection));

  // Obtiene la fecha de la primera fila (la más reciente)
  const mostRecentDate = sortedData.length > 0 ? sortedData[0].Date_detection : '';
    return data
    .filter(row => row.Date_detection === mostRecentDate)
    .map((row, index) => (
      
      <tr key={index} className={styles.rowHover} onClick={() => onRowClick(row)}>
      <th scope="row">{index + 1}</th>
      <th scope="row">{row.Date_detection}</th>
      <td>{row.Crypto1_ID}</td>
      <td>{row.Crypto2_ID}</td>
      <td>{row.Spread.toFixed(8)}</td>
    </tr>
    ));
  };

  return (
    <div className={styles.pairsList}>
      <div className={styles.tableContainer}>
        <div className={styles.titleContainer}>
            <h1 className={styles.title}>ArbStrat Crypto</h1>
            <button type="button" class="btn btn-outline-info">Arbitrage Simulate</button>
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
