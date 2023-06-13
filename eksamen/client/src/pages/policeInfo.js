import React, { useState, useEffect } from "react";
import styles from "../mypage.module.css";
import { NavLink } from "react-router-dom";
import axios from "axios";

function PoliceInfo() {
  const [boatSpots, setBoatSpots] = useState([]);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await axios.get("http://localhost:5000/record/find");
      const recordsData = response.data;
      setRecords(recordsData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBoatSpots();
  }, []);

  const fetchBoatSpots = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/registerBoat/seeBoats"
      );
      const boatSpotsData = response.data;
      setBoatSpots(boatSpotsData);
    } catch (error) {
      console.log(error);
    }
  };

  const createRecord = async (event) => {
    event.preventDefault();

    try {
      const recordData = {
        username: event.target.username.value,
        mailadress: event.target.mailadress.value,
        date: event.target.date.value,
        reason: event.target.reason.value,
      };

      const response = await axios.post(
        "http://localhost:5000/record/make",
        recordData
      );
      const createdRecord = response.data;
      console.log("Created Record:", createdRecord);

      // Clear the form after successful submission
      event.target.reset();

      // Fetch updated records
      fetchRecords();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.homeDiv}>
      <div className={styles.navbar}>
        <div className={styles.navItem}>
          <NavLink to="/userhome" className={styles.active}>
            Bølger&Skvalp
          </NavLink>
        </div>
        <div className={styles.navItem}>
          <NavLink to="/mypage" className={styles.active}>
            Min side
          </NavLink>
        </div>
        <div className={styles.navItem}>
          <NavLink to="/signup" className={styles.active}>
            Logg ut
          </NavLink>
        </div>
      </div>
      <div className={styles.myPage}>
        <div className={styles.createBoatForm}>
          <h1>Registrer politihistorie</h1>
          <form onSubmit={createRecord}>
            <label htmlFor="username">Brukernavn:</label>
            <input type="text" id="username" name="username" required />
            <label htmlFor="mailadress">E-mail:</label>
            <input type="email" id="mailadress" name="mailadress" required />
            <label htmlFor="date">Dato:</label>
            <input type="date" id="date" name="date" required />
            <label htmlFor="reason">Årsak:</label>
            <input type="text" id="reason" name="reason" required />
            <button type="submit">Registrer hendelse</button>
          </form>
        </div>
        <div className={styles.moreText}>
          <h2>Tidligere hendelser:</h2>
        </div>
        <div className={styles.boatSpots}>
          <ul className={styles.boatList}>
            {records
              .sort((a, b) => a.Båtplass - b.Båtplass)
              .map((record, i) => (
                <li key={i} className={styles.boatItem}>
                  <div className={styles.memberInfo}>
                    <div>Brukernavn: {record.username}</div>
                    <div>
                      Dato: {new Date(record.date).toLocaleDateString()}
                    </div>
                    <div>Årsak: {record.reason}</div>
                    <div>E-mail: {record.mailadress}</div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PoliceInfo;
