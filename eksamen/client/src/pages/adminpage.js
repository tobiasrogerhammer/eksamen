import React, { useState, useEffect, useCallback } from "react";
import styles from "../adminpage.module.css";
import axios from "axios";
import { API_ENDPOINTS } from "../config";
import { useToast, ToastContainer } from "../components/Toast";
import Navbar from "../components/Navbar";

function Adminpage() {
  const [members, setMembers] = useState([]);
  const [boats, setBoats] = useState([]);
  const [query, setQuery] = useState("");
  const [boatQuery, setBoatQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.ADMIN_SEE_USERS);
      const users = response.data.map((user) => ({
        _id: user._id,
        mailadress: user.mailadress,
        isAdmin: user.isAdmin,
        username: user.username,
      }));
      setMembers(users);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Error fetching users";
      showToast(errorMessage, "error");
      console.error("Error fetching users:", error);
    }
  }, [showToast]);

  const fetchBoats = useCallback(async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.BOAT_SEE);
      const boats = response.data;
      setBoats(boats);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Error fetching boats";
      showToast(errorMessage, "error");
      console.error("Error fetching boats:", error);
    }
  }, [showToast]);

  useEffect(() => {
    fetchUsers();
    fetchBoats();
    const intervalId = setInterval(fetchUsers, 10000);
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchUsers, fetchBoats]);

  const updateUserStatus = async (userId, isAdmin) => {
    try {
      await axios.put(API_ENDPOINTS.ADMIN_UPDATE_USER(userId), {
        isAdmin: !isAdmin, // Toggle the isAdmin status
      });
      showToast("User status updated successfully!", "success");
      fetchUsers(); // Fetch updated users after updating status
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Error updating user status";
      showToast(errorMessage, "error");
      console.error("Error updating user status:", error);
    }
  };

  const createBoat = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const boatData = {
        Adresse: event.target.adresse.value.trim(),
        Postnummer: parseInt(event.target.postnummer.value),
        Poststed: event.target.poststed.value.trim(),
        Båtplass: parseInt(event.target.båtplass.value),
        startUse: event.target.startUse.value,
        endUse: event.target.endUse.value,
        mailadress: event.target.mailadress.value.trim(),
      };

      const response = await axios.post(API_ENDPOINTS.BOAT_CREATE, boatData);
      showToast(
        response.data.message || "Boat registered successfully!",
        "success"
      );
      event.target.reset();
      fetchBoats(); // Refresh the list
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Error registering boat";
      showToast(errorMessage, "error");
      console.error("Error registering boat:", error);
    } finally {
      setLoading(false);
    }
  };

  const navbarItems = [
    { to: "/adminpage", label: "Admin" },
    { to: "/signup", label: "Logg ut" },
  ];

  return (
    <div className={styles.pageWrapper}>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <Navbar title="Admin Panel" items={navbarItems} />
      <div className={styles.pageContainer}>
        <div className={styles.contentWrapper}>
          {/* Users Section */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h1 className={styles.cardTitle}>
                <span className={styles.sectionIcon}>👥</span>
                Brukere
              </h1>
              <p className={styles.cardSubtitle}>
                Administrer brukere og deres admin-rettigheter
              </p>
        </div>
            <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.search}
                placeholder="Søk etter brukernavn..."
            onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className={styles.listContainer}>
            {members
                .filter((user) =>
                  user.username.toLowerCase().includes(query.toLowerCase())
                )
              .map((member) => (
                  <div key={member._id} className={styles.listItem}>
                    <div className={styles.itemContent}>
                      <div className={styles.itemHeader}>
                        <span className={styles.itemTitle}>
                          {member.username}
                        </span>
                        <label className={styles.toggleSwitch}>
                      <input
                        type="checkbox"
                        checked={member.isAdmin}
                        onChange={() =>
                              updateUserStatus(member._id, member.isAdmin)
                        }
                      />
                          <span className={styles.toggleSlider}></span>
                          <span className={styles.toggleLabel}>
                            {member.isAdmin ? "Admin" : "Bruker"}
                          </span>
                        </label>
                      </div>
                      <div className={styles.itemDetails}>
                        <span className={styles.itemDetail}>
                          <span className={styles.detailIcon}>📧</span>
                          {member.mailadress}
                        </span>
                        <span
                          className={`${styles.badge} ${
                            member.isAdmin
                              ? styles.badgeAdmin
                              : styles.badgeUser
                          }`}
                        >
                          {member.isAdmin ? "Administrator" : "Standard bruker"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              {members.filter((user) =>
                user.username.toLowerCase().includes(query.toLowerCase())
              ).length === 0 && (
                <div className={styles.emptyState}>Ingen brukere funnet</div>
              )}
            </div>
          </div>

          {/* Boats Section */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h1 className={styles.cardTitle}>
                <span className={styles.sectionIcon}>⛵</span>
                Båter
              </h1>
              <p className={styles.cardSubtitle}>
                Oversikt over alle registrerte båtplasser
              </p>
        </div>
            <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.search}
                placeholder="Søk etter båtplass nummer..."
            onChange={(e) => setBoatQuery(e.target.value)}
              />
            </div>
            <div className={styles.listContainer}>
            {boats
              .filter((boat) => boat.Båtplass.toString().includes(boatQuery))
              .sort((a, b) => a.Båtplass - b.Båtplass)
              .map((boat, i) => (
                  <div key={i} className={styles.listItem}>
                    <div className={styles.itemContent}>
                      <div className={styles.itemHeader}>
                        <span className={styles.itemTitle}>
                          Båtplass #{boat.Båtplass}
                        </span>
                      </div>
                      <div className={styles.itemDetails}>
                        <span className={styles.itemDetail}>
                          <span className={styles.detailIcon}>📅</span>
                          {new Date(boat.startUse).toLocaleDateString(
                            "nb-NO"
                          )}{" "}
                          - {new Date(boat.endUse).toLocaleDateString("nb-NO")}
                        </span>
                        <span className={styles.itemDetail}>
                          <span className={styles.detailIcon}>📧</span>
                          {boat.mailadress}
                        </span>
                        <span className={styles.itemDetail}>
                          <span className={styles.detailIcon}>📍</span>
                          {boat.Adresse}, {boat.Postnummer} {boat.Poststed}
                        </span>
                    </div>
                    </div>
                  </div>
                ))}
              {boats.filter((boat) =>
                boat.Båtplass.toString().includes(boatQuery)
              ).length === 0 && (
                <div className={styles.emptyState}>Ingen båter funnet</div>
              )}
            </div>
          </div>

          {/* Create Boat Form */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h1 className={styles.cardTitle}>
                <span className={styles.sectionIcon}>➕</span>
                Reserver båtplass
              </h1>
              <p className={styles.cardSubtitle}>
                Opprett en ny båtplassreservasjon
              </p>
            </div>
            <form onSubmit={createBoat} className={styles.form}>
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}>📧</span>
                  Kontaktinformasjon
                </h3>
                <div className={styles.formGroup}>
                  <label htmlFor="mailadress" className={styles.formLabel}>
                    E-postadresse
                  </label>
                  <input
                    type="email"
                    id="mailadress"
                    name="mailadress"
                    className={styles.formInput}
                    placeholder="din.epost@eksempel.no"
                    required
                  />
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}>📍</span>
                  Adresse
                </h3>
                <div className={styles.formGroup}>
                  <label htmlFor="adresse" className={styles.formLabel}>
                    Gateadresse
                  </label>
                  <input
                    type="text"
                    id="adresse"
                    name="adresse"
                    className={styles.formInput}
                    placeholder="Gateadresse 123"
                    required
                  />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="postnummer" className={styles.formLabel}>
                      Postnummer
                    </label>
                    <input
                      type="number"
                      id="postnummer"
                      name="postnummer"
                      className={styles.formInput}
                      placeholder="0000"
                      required
                      min="0"
                      max="9999"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="poststed" className={styles.formLabel}>
                      Poststed
                    </label>
                    <input
                      type="text"
                      id="poststed"
                      name="poststed"
                      className={styles.formInput}
                      placeholder="By"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}>⛵</span>
                  Båtplassreservasjon
                </h3>
                <div className={styles.formGroup}>
                  <label htmlFor="båtplass" className={styles.formLabel}>
                    Båtplassnummer
                  </label>
                  <input
                    type="number"
                    id="båtplass"
                    name="båtplass"
                    className={styles.formInput}
                    placeholder="1"
                    required
                    min="1"
                  />
                  <span className={styles.formHint}>
                    Velg ønsket båtplassnummer
                  </span>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="startUse" className={styles.formLabel}>
                    Fra dato
                  </label>
                  <input
                    type="date"
                    id="startUse"
                    name="startUse"
                    className={styles.formInput}
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="endUse" className={styles.formLabel}>
                    Til dato
                  </label>
                  <input
                    type="date"
                    id="endUse"
                    name="endUse"
                    className={styles.formInput}
                    required
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="submit"
                  className={styles.btnPrimary}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className={styles.btnSpinner}>⏳</span>
                      Registrerer...
                    </>
                  ) : (
                    <>
                      <span className={styles.btnIcon}>✓</span>
                      Reserver båtplass
                    </>
                  )}
                </button>
        </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Adminpage;
