import React, { useState, useEffect } from "react";
import styles from "../mypage.module.css";
import { NavLink } from "react-router-dom";
import axios from "axios";

function Mypage() {
  const [boatSpots, setBoatSpots] = useState([]);

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

  const createBoat = async (event) => {
    event.preventDefault();

    try {
      const boatData = {
        Adresse: event.target.adresse.value,
        Postnummer: parseInt(event.target.postnummer.value),
        Poststed: event.target.poststed.value,
        Båtplass: parseInt(event.target.båtplass.value),
        startUse: event.target.startUse.value,
        endUse: event.target.endUse.value,
        mailadress: event.target.mailadress.value,
      };

      const response = await axios.post(
        "http://localhost:5000/registerBoat/createBoat",
        boatData
      );
      const createdBoat = response.data;
      console.log("Created Boat:", createdBoat);
      console.log(boatData);

      // Clear the form after successful submission
      event.target.reset();
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
          <h1>Registrer en båt</h1>
          <form onSubmit={createBoat}>
            <label htmlFor="adresse">Min adresse:</label>
            <input type="text" id="adresse" name="adresse" required />
            <label htmlFor="postnummer">Post Kode:</label>
            <input type="number" id="postnummer" name="postnummer" required />
            <label htmlFor="poststed">Post sted:</label>
            <input type="text" id="poststed" name="poststed" required />
            <label htmlFor="båtplass">Båtplass:</label>
            <input type="number" id="båtplass" name="båtplass" required />
            <label htmlFor="startUse">Opptatt fra:</label>
            <input type="date" id="startUse" name="startUse" required />
            <label htmlFor="endUse">Opptatt til:</label>
            <input type="date" id="endUse" name="endUse" required />
            <label htmlFor="mailadress">E-mail:</label>
            <input type="text" id="mailadress" name="mailadress" required />
            <button type="submit">Reserver plass</button>
          </form>
        </div>
        <div className={styles.moreText}>
          <h2>Opptatte plasser:</h2>
        </div>
        <div className={styles.boatSpots}>
          <ul className={styles.boatList}>
            {boatSpots
              .sort((a, b) => a.Båtplass - b.Båtplass) // Sort the array based on Båtplass number
              .map((boat, i) => (
                <li key={i} className={styles.boatItem}>
                  <div className={styles.memberInfo}>
                    <div>Båtplass: {boat.Båtplass}</div>
                    <div>
                      I bruk fra: {new Date(boat.startUse).toLocaleDateString()}
                    </div>
                    <div>
                      I bruk til: {new Date(boat.endUse).toLocaleDateString()}
                    </div>
                    <div>E-mail: {boat.mailadress}</div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Mypage;
