import React, { useState, useEffect } from "react";
import styles from "../mypage.module.css";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config";
import { useToast, ToastContainer } from "../components/Toast";
import Navbar from "../components/Navbar";

function PoliceInfo() {
  const [boatSpots, setBoatSpots] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => {
    fetchRecords();
    fetchBoatSpots();
  }, []);

  const fetchRecords = async () => {
    setFetching(true);
    try {
      const response = await axios.get(API_ENDPOINTS.RECORD_FIND);
      setRecords(response.data);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Error fetching records";
      showToast(errorMessage, "error");
      console.error("Error fetching records:", error);
    } finally {
      setFetching(false);
    }
  };

  const fetchBoatSpots = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.BOAT_SEE);
      setBoatSpots(response.data);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Error fetching boat spots";
      showToast(errorMessage, "error");
      console.error("Error fetching boat spots:", error);
    }
  };

  const createRecord = async (event) => {
    event.preventDefault();
    setLoading(true);

      const recordData = {
      username: event.target.username.value.trim(),
      mailadress: event.target.mailadress.value.trim(),
        date: event.target.date.value,
      reason: event.target.reason.value.trim(),
      };

    // Client-side validation
    if (!recordData.username || recordData.username.length < 3) {
      showToast("Username must be at least 3 characters", "error");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recordData.mailadress)) {
      showToast("Invalid email format", "error");
      setLoading(false);
      return;
    }

    if (!recordData.date) {
      showToast("Date is required", "error");
      setLoading(false);
      return;
    }

    if (!recordData.reason || recordData.reason.length === 0) {
      showToast("Reason is required", "error");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        API_ENDPOINTS.RECORD_CREATE,
        recordData
      );
      showToast(
        response.data.message || "Record created successfully!",
        "success"
      );
      event.target.reset();
      fetchRecords(); // Refresh the list
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Error creating record";
      showToast(errorMessage, "error");
      console.error("Error creating record:", error);
    } finally {
      setLoading(false);
    }
  };

  const navbarItems = [
    { to: "/userhome", label: "Hjem" },
    { to: "/mypage", label: "Min side" },
    { to: "/signup", label: "Logg ut" },
  ];

  return (
    <div className={styles.homeDiv}>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <Navbar items={navbarItems} />
      <div className={styles.myPage}>
        <div className={styles.createBoatForm}>
          <h1>Registrer politihistorie</h1>
          <form onSubmit={createRecord}>
            <label htmlFor="username">Brukernavn:</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              minLength={3}
              maxLength={30}
            />
            <label htmlFor="mailadress">E-mail:</label>
            <input type="email" id="mailadress" name="mailadress" required />
            <label htmlFor="date">Dato:</label>
            <input type="date" id="date" name="date" required />
            <label htmlFor="reason">Årsak:</label>
            <input type="text" id="reason" name="reason" required />
            <button type="submit" disabled={loading}>
              {loading ? "Registrerer..." : "Registrer hendelse"}
            </button>
          </form>
        </div>
        <div className={styles.moreText}>
          <h2>Tidligere hendelser:</h2>
          {fetching && <p>Loading...</p>}
        </div>
        <div className={styles.boatSpots}>
          <ul className={styles.boatList}>
            {records
              .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date, newest first
              .map((record, i) => (
                <li key={record._id || i} className={styles.boatItem}>
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
