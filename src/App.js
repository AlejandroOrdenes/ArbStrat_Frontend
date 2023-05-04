import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useState } from "react";
import Navbar from "./components/Navbar.js";
import { CointPairs } from "./components/CointPairs.js";
import { CointegrationChart } from "./components/CointegrationChart.js";
import { MetricsCards } from "./components/MetricsCards.js";
import "./App.css";
import { ZScoreChart } from "./components/ZScoreChart.js";
import { SpreadChart } from "./components/SpreadChart.js";
import { Footer } from "./components/Footer.js";
import { ListTrades } from "./components/ListTrades.js";

function App() {
  const [selectedRow, setSelectedRow] = useState(null);
  const handleRowClick = (row) => {
    setSelectedRow(row);
  };

  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>
          <Route
            path="/cointegration"
            element={
              <div className="dataContainer">
                <CointPairs onRowClick={handleRowClick} />
                <div className="chartPairs">
                  {selectedRow && <MetricsCards rowData={selectedRow} />}
                  {selectedRow && (
                    <div className="cointegrated">
                      <CointegrationChart
                        market1={selectedRow}
                        market2={selectedRow}
                      />
                    </div>
                  )}
                  <div className="metricsChart">
                    {selectedRow && (
                      <div className="zscore">
                        <ZScoreChart rowData={selectedRow} />
                      </div>
                    )}
                    {selectedRow && (
                      <div className="spread">
                        <SpreadChart rowData={selectedRow} />
                      </div>
                    )}
                  </div>
                </div>
                
              </div>
            }
          />
          <Route path="/trades" element={<ListTrades />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
