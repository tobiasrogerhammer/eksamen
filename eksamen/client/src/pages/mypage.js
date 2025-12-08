import React, { useState, useEffect, useCallback } from "react";
import styles from "../mypage.module.css";
import axios from "axios";
import { API_ENDPOINTS } from "../config";
import { useToast, ToastContainer } from "../components/Toast";
import Navbar from "../components/Navbar";

function Mypage() {
  const [boatSpots, setBoatSpots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  const fetchBoatSpots = useCallback(async () => {
    setFetching(true);
    try {
      const response = await axios.get(API_ENDPOINTS.BOAT_SEE);
      setBoatSpots(response.data);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Error fetching boat spots";
      showToast(errorMessage, "error");
      console.error("Error fetching boat spots:", error);
    } finally {
      setFetching(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchBoatSpots();
  }, [fetchBoatSpots]);

  const createBoat = async (event) => {
    event.preventDefault();
    setLoading(true);

    const boatData = {
      Adresse: event.target.adresse.value.trim(),
      Postnummer: parseInt(event.target.postnummer.value),
      Poststed: event.target.poststed.value.trim(),
      Båtplass: parseInt(event.target.båtplass.value),
      startUse: event.target.startUse.value,
      endUse: event.target.endUse.value,
      mailadress: event.target.mailadress.value.trim(),
    };

    // Client-side validation
    if (!boatData.Adresse) {
      showToast("Address is required", "error");
      setLoading(false);
      return;
    }

    if (
      isNaN(boatData.Postnummer) ||
      boatData.Postnummer < 0 ||
      boatData.Postnummer > 9999
    ) {
      showToast("Postnummer must be a valid 4-digit number", "error");
      setLoading(false);
      return;
    }

    if (!boatData.Poststed) {
      showToast("Poststed is required", "error");
      setLoading(false);
      return;
    }

    if (isNaN(boatData.Båtplass) || boatData.Båtplass < 1) {
      showToast("Båtplass must be a positive number", "error");
      setLoading(false);
      return;
    }

    if (!boatData.startUse || !boatData.endUse) {
      showToast("Start date and end date are required", "error");
      setLoading(false);
      return;
    }

    if (new Date(boatData.startUse) >= new Date(boatData.endUse)) {
      showToast("Start date must be before end date", "error");
      setLoading(false);
      return;
    }

    if (new Date(boatData.startUse) < new Date()) {
      showToast("Start date cannot be in the past", "error");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(boatData.mailadress)) {
      showToast("Invalid email format", "error");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(API_ENDPOINTS.BOAT_CREATE, boatData);
      showToast(
        response.data.message || "Boat registered successfully!",
        "success"
      );
      event.target.reset();
      fetchBoatSpots(); // Refresh the list
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
    { to: "/userhome", label: "Hjem" },
    { to: "/mypage", label: "Min side" },
    { to: "/signup", label: "Logg ut" },
  ];

  return (
    <div className={styles.pageWrapper}>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <Navbar items={navbarItems} />
      <div className={styles.pageContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h1 className={styles.cardTitle}>Registrer en båt</h1>
              <p className={styles.cardSubtitle}>
                Fyll ut informasjonen nedenfor for å reservere en båtplass
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
            </form>
          </div>

          <div className={styles.listSection}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Opptatte plasser</h2>
              {fetching ? (
                <div className={styles.loading}>Laster...</div>
              ) : boatSpots.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>Ingen båter registrert ennå.</p>
                </div>
              ) : (
                <div className={styles.boatList}>
                  {boatSpots
                    .sort((a, b) => a.Båtplass - b.Båtplass)
                    .map((boat) => (
                      <div key={boat._id} className={styles.boatItem}>
                        <div className={styles.boatItemHeader}>
                          <span className={styles.boatNumber}>
                            Båtplass #{boat.Båtplass}
                          </span>
                        </div>
                        <div className={styles.boatItemBody}>
                          <div className={styles.boatInfo}>
                            <span className={styles.boatLabel}>Fra:</span>
                            <span>
                              {new Date(boat.startUse).toLocaleDateString(
                                "no-NO"
                              )}
                            </span>
                          </div>
                          <div className={styles.boatInfo}>
                            <span className={styles.boatLabel}>Til:</span>
                            <span>
                              {new Date(boat.endUse).toLocaleDateString(
                                "no-NO"
                              )}
                            </span>
                          </div>
                          <div className={styles.boatInfo}>
                            <span className={styles.boatLabel}>E-mail:</span>
                            <span>{boat.mailadress}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mypage;
