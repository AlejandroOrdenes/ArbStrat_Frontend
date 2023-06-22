import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../cointegration/CointPairs.module.css";
import {
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill
} from "react-icons/bs";
const KEY_SELECTED_PAIR_ID = "selectedPairID";

export const CointPairs = ({ onRowClick, selectedRow = { id: 22 } }) => {
  const [data, setData] = useState([]);
  const [selectedPairID, setSelectedPairID] = useState(() => {
    const storedID = localStorage.getItem(KEY_SELECTED_PAIR_ID);
    return storedID !== null ? parseInt(storedID) : null;
  });
  const [filteredRows, setFilteredRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [newOrder, setNewOrder] = useState([]);

  useEffect(() => {
    if (selectedRow && selectedRow.id) {
      setSelectedPairID(selectedRow.id);
      localStorage.setItem(KEY_SELECTED_PAIR_ID, selectedRow.id);
    }
  }, [selectedRow]);

  useEffect(() => {
    fetchData();
    console.log("IPDPAIR!!!!!!!!!!!!!!!!")
    
  }, []);

  const handleZScoreOrder = () => {
    setOrder(order === "asc" ? "desc" : "asc");
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/cointegratedPairs/"
      );

      setData(response.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  useEffect(() => {
    const currentDate = new Date();
    const oneDayAgo = new Date();
    oneDayAgo.setDate(currentDate.getDate() - 1);

    const parsedData = typeof data === "string" ? JSON.parse(data) : data;
    const sortedData = parsedData.sort(
      (a, b) => new Date(b.Date_detection) - new Date(a.Date_detection)
    );

    const rows = sortedData.filter((row) => {
      const rowDate = new Date(row.Date_detection);
      return rowDate >= oneDayAgo && rowDate <= currentDate;
    });

    setFilteredRows(rows);
    
  }, [data]);

  const handleRowClick = (id, index) => {
    console.log(`Clicked on id ${id}`);
    setSelectedPairID(id);
    localStorage.setItem(KEY_SELECTED_PAIR_ID, id.toString());
    const selectedRow = newOrder[index];
    if (selectedRow) {
      onRowClick(selectedRow);
    }
  };

  useEffect(() => {
    const sortedRows = [...filteredRows].sort((a, b) => {
      const zScoreA = parseFloat(a.z_score[a.Spread.length - 1]);
      const zScoreB = parseFloat(b.z_score[b.Spread.length - 1]);
  
      if (order === "asc") {
        return zScoreA - zScoreB;
      } else {
        return zScoreB - zScoreA;
      }
    });
  
    setNewOrder(sortedRows);
  }, [filteredRows, order]); 

  const renderTableRows = () => {
    return newOrder.map((row, index) => (
      
      <tr
        key={index}
        onClick={() => handleRowClick(row.id, index)}
        className={`${
          selectedPairID === row.id ? styles.selectedRow : ""
        } ${styles.hoverCss}`}
      >
        <th>{index + 1}</th>
        <td>{row.Crypto1_ID}</td>
        <td>{row.Crypto2_ID}</td>
        <td>{parseFloat(row.z_score[row.Spread.length - 1]).toFixed(2)}</td>
      </tr>
    ));
  };

  return (
    // <div className={styles.pairsList}>
    <div className={styles.tableContainer}>
      {/* <div className={styles.titleContainer}>
          <h1 className={styles.title}>ArbStrat Crypto</h1>
        </div> */}

      <div className={styles.table}>
        <h4 className={styles.title}>Cointegrated Pairs</h4>
        <div className={styles.dataTable}>
          <table class="table table-dark table-striped table-hover">
            <thead>
              <tr>
                {/* <th scope="col">N°</th>
                  <th scope="col">Date</th> */}
                <th scope="col">N°</th>
                <th scope="col">Base Market</th>
                <th scope="col">Quote Market</th>
                <th scope="col">
                  ZScore{" "}
                  {order === "asc" ? (
          <BsFillArrowDownCircleFill className={styles.zscoreOrder} onClick={handleZScoreOrder}/>
        ) : (
          <BsFillArrowUpCircleFill className={styles.zscoreOrder} onClick={handleZScoreOrder} />
        )}
                </th>
                {/* <th scope="col">Spread</th> */}
              </tr>
            </thead>
            <tbody style={{ color: "white" }}>{renderTableRows()}</tbody>
          </table>
        </div>
      </div>
    </div>
    // </div>
  );
};
