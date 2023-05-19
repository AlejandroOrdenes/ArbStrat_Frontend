import React, { useState, useEffect, useRef } from "react";
import "./Profile.module.css";
import styles from "./Profile.module.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { BsPersonCircle, BsGear } from "react-icons/bs";
import { BsCamera } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Dropdown } from "react-bootstrap";
import axios from "axios";

export const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const [isAlertSettingsVisible, setAlertSettingsVisible] = useState(true);

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
        setName(data.username);
        setEmail(data.email);
        setImage(`http://localhost:8000${data.image_profile}`);
        console.log(data.image_profile);
      })

      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file))
    console.log(file)
    if (file && file.type.substr(0, 5) === "image") {
      console.log("ES IMAGEN")

      
      
      console.log(image)
      // Create a new FormData instance
      const formData = new FormData();
      formData.append("profile_picture", file);
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/userUpdate/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
    e.target.value = null;
  };

  const handleDeletePhoto = () => {
    setImage(null);
    // Aquí podrías enviar la solicitud para eliminar la imagen del servidor...
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar la lógica de actualización del perfil
    console.log({ name, email, password });
  };

  const handleAlertSettingsToggle = () => {
    setAlertSettingsVisible((prevVisible) => !prevVisible);
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>Account Settings</h1>
      </div>
      <div className={styles.cardsContainer}>
        <div className={styles.cardContainer}>
          <h3>Personal</h3>
          <hr></hr>
          <div className={styles.iconContainer}>
            {image ? (
              <img
                className={styles.profileImage}
                src={image}
                alt="Profile"
              />
            ) : (
              <BsPersonCircle className={styles.person} />
            )}
            <input
              ref={fileInputRef}
              type="file"
              hidden
              onChange={handleFileChange}
            />
            <div className={styles.cameraContainer}>
              <Dropdown>
                <Dropdown.Toggle
                  as={BsCamera}
                  className={styles.camera}
                  id="dropdown-basic"
                />

                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleUploadClick}>
                    Upload Photo
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleDeletePhoto}>
                    Delete Photo
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <Form className={styles.changeDataForm}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder={email} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicUserName">
              <Form.Label>UserName</Form.Label>
              <Form.Control type="text" placeholder={name} />
            </Form.Group>

            <button className={styles.button} variant="primary" type="submit">
              Save Changes
            </button>
          </Form>
        </div>
        <div className={styles.passAlertContainer}>
          <div className={styles.cardContainer3}>
            <div className={styles.alertsSettingIconContainer}>
              <h3>Alerts</h3>
              <BsGear
                className={styles.settingsIcon}
                onClick={handleAlertSettingsToggle}
              />
            </div>

            <hr></hr>
            <div className={styles.alertsSetting}>
              <div className={styles.group1Alert}>
                <Form.Group className="mb-3" controlId="whatsappAlert">
                  <Form.Check
                    type="switch"
                    label="Whatsapp"
                    id="custom-switch-1"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="telegramAlert">
                  <Form.Check
                    type="switch"
                    label="Telegram"
                    id="custom-switch-2"
                  />
                </Form.Group>
              </div>

              <div className={styles.group2Alert}>
                <Form.Group className="mb-3" controlId="discordAlert">
                  <Form.Check
                    type="switch"
                    label="Discord"
                    id="custom-switch-3"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="emailAlert">
                  <Form.Check
                    type="switch"
                    label="Email"
                    id="custom-switch-4"
                  />
                </Form.Group>
              </div>
            </div>
          </div>
          <div className={styles.cardContainer2}>
            <h3>Password</h3>
            <hr></hr>
            <Form className={styles.changeDataFormPass}>
              <Form.Group className="mb-3" controlId="formcurrentPassword">
                <Form.Label></Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter Current Pass"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="newPassword">
                <Form.Label></Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="repeatNewPassword">
                <Form.Label></Form.Label>
                <Form.Control type="password" placeholder="Repeat Password" />
              </Form.Group>

              <button
                className={styles.buttonPass}
                variant="primary"
                type="submit"
              >
                Save Password
              </button>
            </Form>
          </div>
        </div>
        {/* <div className={`${styles.settingsAlertContainer} ${isAlertSettingsVisible ? styles.visible : ''}`}>
          <h3>Alerts Settings</h3>
          <hr></hr>
          <div className={styles.iconContainer}>
            {image ? (
              <img className={styles.profileImage} src={image} alt="Profile" />
            ) : (
              <BsPersonCircle className={styles.person} />
            )}
            <input
              ref={fileInputRef}
              type="file"
              hidden
              onChange={handleFileChange}
            />
            <div className={styles.cameraContainer}>
              <Dropdown>
                <Dropdown.Toggle
                  as={BsCamera}
                  className={styles.camera}
                  id="dropdown-basic"
                />

                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleUploadClick}>
                    Upload Photo
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleDeletePhoto}>
                    Delete Photo
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <Form className={styles.changeDataForm}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder={email} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicUserName">
              <Form.Label>UserName</Form.Label>
              <Form.Control type="text" placeholder={name} />
            </Form.Group>

            <button className={styles.button} variant="primary" type="submit">
              Save Changes
            </button>
          </Form>
        </div> */}
      </div>
    </div>
  );
};
