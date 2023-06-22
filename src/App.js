import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useState } from "react";
import Navbar from "./components/cointegration/Navbar.js";
import { CointPairs } from "./components/cointegration/CointPairs.js";
import { CointegrationChart } from "./components/cointegration/CointegrationChart.js";
import { MetricsCards } from "./components/cointegration/MetricsCards.js";
import "./App.css";
import { ZScoreChart } from "./components/cointegration/ZScoreChart.js";
import { SpreadChart } from "./components/cointegration/SpreadChart.js";
import { Footer } from "./components/cointegration/Footer.js";
import { ListTrades } from "./components/cointegration/ListTrades.js";
import { Home } from "./components/home/Home.js";
import { Login } from "./components/home/Login.js";
import { Profile } from "./components/profile/Profile.js";
import { useDispatch } from "react-redux";
import { logout } from "../../front/src/store/actions.js";
import { SignUp } from "./components/home/SignUp.js";
import { useSelector } from "react-redux";
import { About } from "./components/home/About.js";
import { Verify } from "./components/profile/Verify.js";
import { Recovery } from "./components/home/Recovery.js";

function App() {
  const [selectedRow, setSelectedRow] = useState(null);
  const isAuthenticated = useSelector((state) => state.auth.token !== null);

  const handleRowClick = (row) => {
    console.log(row)
    setSelectedRow(row);
  };

  const dispatch = useDispatch();

  const handleLogout = () => {
    // Llama a la acción de logout para actualizar el estado de Redux
    dispatch(logout());

    // Borra el token y otros datos del almacenamiento local
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem("userId");
    // ... (borrar otros datos necesarios)
  };

  return (
    <Router>
      {/* {isAuthenticated && } */}
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recovery" element={<Recovery />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/verify" element={<Verify />} />
          {isAuthenticated && (
            <Route
              path="/trades"
              element={
                <div>
                  <Navbar onLogout={handleLogout} />
                  <ListTrades onRowClick={handleRowClick}/>
                  <Footer />
                </div>
              }
            />
          )}
          {isAuthenticated && (
            <Route
              path="/profile"
              element={
                <div>
                  <Navbar onLogout={handleLogout} />
                  <Profile />
                  <Footer />
                </div>
              }
            />
          )}
          {isAuthenticated && (
            <Route
              path="/cointegration"
              element={
                <div className="dataContainer">
                  <Navbar onLogout={handleLogout} />
                  <div className="pairsContainer">
                    <div className="firstData">
                      <CointPairs onRowClick={handleRowClick} selectedRow={selectedRow}/>
                      
                      {selectedRow && <MetricsCards rowData={selectedRow} />}  
                    </div>
                    
                    <div className="dataContainer">
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

                  <div className="chartPairs">
                    
                    {selectedRow && (
                      <div className="cointegrated">
                        <CointegrationChart
                          market1={selectedRow}
                          market2={selectedRow}
                        />
                      </div>
                    )}
                  </div>
                  <Footer />
                </div>
              }
            />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
