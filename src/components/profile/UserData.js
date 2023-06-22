import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Profile.module.css";
import styles from "./Profile.module.css";
import Form from "react-bootstrap/Form";
import { BsPersonCircle } from "react-icons/bs";
import { BsCamera } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Dropdown } from "react-bootstrap";
import axios from "axios";
import Toast from "react-bootstrap/Toast";

export const UserData = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const [isNameChanged, setIsNameChanged] = useState(false);
  const [isEmailChanged, setIsEmailChanged] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastHeader, setToastHeader] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("");

  const hideToast = useCallback(() => {
    setShowToast(false);
  });

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        hideToast();
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [showToast, hideToast, useCallback]);

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
        if (data.image_profile !== null) {
          setImage(`http://localhost:8000${data.image_profile}`);
        }
      })

      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
    console.log(file);
    if (file && file.type.substr(0, 5) === "image") {
      console.log("ES IMAGEN");

      console.log(image);
      // Create a new FormData instance
      const formData = new FormData();
      formData.append("profile_picture", file);
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/imageUpdate/",
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

  const handleDeletePhoto = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/deleteUserImage/",{},
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setImage(null);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Handler para el campo de nombre de usuario
  const handleNameChange = (e) => {
    setName(e.target.value);
    setIsNameChanged(true);
  };

  // Handler para el campo de correo electrónico
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsEmailChanged(true);
  };

  const changeUserData = async (event) => {
    event.preventDefault();
    if (isNameChanged) {
      try {
        console.log(email);
        const response = await axios.post(
          "http://127.0.0.1:8000/userUpdate/",
          {
            username: name,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response.data);
      } catch (error) {
        console.error("Error during registration:", error.response);
        console.error("Error details:", error.response.data);
      }
    }
    if (isEmailChanged) {
      try {
        console.log(email);
        const response = await axios.post(
          "http://127.0.0.1:8000/emailUpdate/",
          {
            email: email,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("Error during registration:", error.response);
        console.error("Error details:", error.response.data);
      }
    } else {
      setToastColor("#ff4a4a");
      setToastMessage("Please fill out all fields");
      setShowToast(true);
    }

    if (isNameChanged && isEmailChanged) {
      setToastColor("rgb(159, 201, 76)");
      setToastHeader("Change UserName");
      setToastMessage("Update Username and Email Succesfull!!");
      setShowToast(true);
      setEmail(email);
      setName(name);
      setIsEmailChanged(false);
      setIsNameChanged(false);
      console.log("entro a ambos");
    } else if (isNameChanged) {
      console.log("entro a username");
      setToastColor("rgb(159, 201, 76)");
      setToastHeader("Change UserName");
      setToastMessage("UserName Updated Succesfully!!");
      setShowToast(true);
      setName(name);
    } else if (isEmailChanged) {
      console.log("entro a email");
      setToastColor("rgb(159, 201, 76)");
      setToastHeader("Change UserName");
      setToastMessage("Email Updated Succesfully!!");
      setShowToast(true);
      setEmail(email);
    }

    setIsEmailChanged(false);
    setIsNameChanged(false);
  };

  return (
    <div className={styles.cardContainer}>
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        style={{
          position: "fixed",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
          opacity: 1, // Agregar esta línea para eliminar la opacidad
          backgroundColor: toastColor,
          color: "white",

          // Cambiar el color de fondo del header
        }}
      >
        <Toast.Header>
          <strong className="mr-auto">{toastHeader}</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
      <h3>Personal</h3>
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
      <Form className={styles.changeDataForm} onSubmit={changeUserData}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder={email}
            value={email}
            onChange={handleEmailChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicUserName">
          <Form.Label>UserName</Form.Label>
          <Form.Control
            type="text"
            placeholder={name}
            value={name}
            onChange={handleNameChange}
          />
        </Form.Group>

        <button className={styles.button} variant="primary" type="submit">
          Save Changes
        </button>
      </Form>
    </div>
  );
};
