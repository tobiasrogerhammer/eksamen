import React, { useState, useEffect } from "react";
import styles from "../adminpage.module.css";
import { NavLink } from "react-router-dom";
import axios from "axios";

function Adminpage() {
  const [members, setMembers] = useState([]);
  const [boats, setBoats] = useState([]);
  const [query, setQuery] = useState("");
  const [boatQuery, setBoatQuery] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchBoats();
    const intervalId = setInterval(fetchUsers, 10000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/seeUsers");
      const users = response.data.map((user) => ({
        _id: user._id,
        mailadress: user.mailadress,
        isAdmin: user.isAdmin,
        username: user.username,
      }));
      setMembers(users);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBoats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/registerBoat/seeBoats"
      );
      const boats = response.data;
      setBoats(boats);
    } catch (error) {
      console.log(error);
    }
  };

  const updateUserStatus = async (userId, isAdmin) => {
    try {
      await axios.put(`http://localhost:5000/admin/updateUser/${userId}`, {
        isAdmin: !isAdmin, // Toggle the isAdmin status
      });
      fetchUsers(); // Fetch updated users after updating status
      console.log(isAdmin);
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
        <h1>Rediger brukere og båter</h1>
        <div className={styles.navItem}>
          <NavLink to="/signup" className={styles.active}>
            Logg ut
          </NavLink>
        </div>
      </div>
      <div className={styles.myPage}>
        <div className={styles.text}></div>
        <div className={styles.members}>
          <h2 className={styles.chatHeader}>Brukere:</h2>
          <input
            type="text"
            className={styles.search}
            placeholder="Søk..."
            onChange={(e) => setQuery(e.target.value)}
          ></input>
          <ul>
            {members
              .filter((user) => user.username.toLowerCase().includes(query))
              .map((member) => (
                <li key={member._id}>
                  <div className={styles.memberInfo}>
                    <div>Username: {member.username}</div>
                    <div>Email: {member.mailadress}</div>
                    <div>
                      isAdmin: {member.isAdmin ? "Yes" : "No"}
                      <input
                        type="checkbox"
                        checked={member.isAdmin}
                        onChange={() =>
                          updateUserStatus(member._id, !member.isAdmin)
                        }
                      />
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
        <div className={styles.dockspots}>
          <h2 className={styles.chatHeader}>Båter:</h2>
          <input
            type="text"
            className={styles.search}
            placeholder="Søk etter båtplass..."
            onChange={(e) => setBoatQuery(e.target.value)}
          ></input>
          <ul>
            {boats
              .filter((boat) => boat.Båtplass.toString().includes(boatQuery))
              .sort((a, b) => a.Båtplass - b.Båtplass)
              .map((boat, i) => (
                <li key={i}>
                  <div className={styles.memberInfo}>
                    <div>Boat Place: {boat.Båtplass}</div>
                    <div>
                      Start Use: {new Date(boat.startUse).toLocaleDateString()}
                    </div>
                    <div>
                      End Use: {new Date(boat.endUse).toLocaleDateString()}
                    </div>
                    <div>Email: {boat.mailadress}</div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
        <div className={styles.createBoatForm}>
          <h2>Reserver båtplass</h2>
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
      </div>
    </div>
  );
}

export default Adminpage;
