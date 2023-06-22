import React, { useState, useEffect } from "react";
import "./Profile.module.css";
import styles from "./Profile.module.css";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Toast from "react-bootstrap/Toast";
import { useSelector} from "react-redux";

export const Alerts = () => {
  const [emailAlert, setEmailAlert] = useState(false);
  const [discordAlert, setDiscordAlert] = useState(false);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    axios
      .get("http://localhost:8000/getUserAlerts/", {  // Asegúrate de que la URL sea correcta
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,  // Incluye el token en las cabeceras
        },
      })
      .then((response) => {
        const { emailAlert, discordAlert } = response.data;
        setEmailAlert(emailAlert);
        setDiscordAlert(discordAlert);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []); 


  const handleEmailAlertChange = (event) => {
    const isChecked = event.target.checked;
  
    axios
      .post("http://127.0.0.1:8000/updateEmailAlerts/", { emailAlert: isChecked },  {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data)
        setEmailAlert(isChecked)
        
      })
      .catch((error) => {
        console.log(error)
      });
  };

  const handleDiscordAlertChange = (event) => {
    const isChecked = event.target.checked;

    axios
      .post("http://127.0.0.1:8000/updateDiscordAlerts/", 
      { 
        discordAlert: isChecked,

    },
    {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data)
        setDiscordAlert(isChecked)
      })
      .catch((error) => {
        console.log(error)
      });
  };

  return (
    <div className={styles.cardContainer3}>
      <div className={styles.alertsSettingIconContainer}>
        <h3>Z-Score Opportunities Alerts</h3>
      </div>

      <hr></hr>
      <div className={styles.alertsSetting}>
        {/* <div className={styles.group1Alert}>
          <Form.Group className="mb-3" controlId="whatsappAlert">
            <Form.Check type="switch" label="Whatsapp" id="custom-switch-1" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="telegramAlert">
            <Form.Check type="switch" label="Telegram" id="custom-switch-2" />
          </Form.Group>
        </div> */}

        <div className={styles.group2Alert}>
          <Form.Group className="mb-3" controlId="discordAlert">
            <Form.Check
              type="switch"
              label="Discord"
              id="custom-switch-3"
              checked={false}
              onChange={handleDiscordAlertChange}
              disabled={true}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="emailAlert">
            <Form.Check
              type="switch"
              label="Email"
              id="custom-switch-4"
              checked={emailAlert}
              onChange={handleEmailAlertChange}
            />
          </Form.Group>
        </div>
      </div>
    </div>
  );
};
