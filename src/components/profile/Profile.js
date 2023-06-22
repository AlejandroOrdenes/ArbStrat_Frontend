import React from "react";
import "./Profile.module.css";
import styles from "./Profile.module.css";
import { Password } from "./Password";
import { Alerts } from "./Alerts";
import { UserData } from "./UserData";

export const Profile = () => {
  return (
    <div className={styles.profileContainer}>
      
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>Account Settings</h1>
      </div>
      <div className={styles.cardsContainer}>
        <UserData></UserData>
        <div className={styles.passAlertContainer}>
          <Alerts></Alerts>
          <Password></Password>
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
