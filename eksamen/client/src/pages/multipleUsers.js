import React, { useState } from "react";
import axios from "axios";
import styles from "../multipleUsers.module.css";
import { NavLink } from "react-router-dom";
import Navbar from "../components/Navbar";
import { API_ENDPOINTS } from "../config";
import { useToast, ToastContainer } from "../components/Toast";

const MultipleUsers = () => {
  const [users, setUsers] = useState([
    { username: "", mailadress: "", password: "", showPassword: false },
  ]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const { toasts, showToast, removeToast } = useToast();

  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const updatedUsers = [...users];
    updatedUsers[index][name] = value;
    setUsers(updatedUsers);
  };

  const handleAddUser = () => {
    setUsers([
      ...users,
      { username: "", mailadress: "", password: "", showPassword: false },
    ]);
  };

  const handleRemoveUser = (index) => {
    if (users.length > 1) {
      const updatedUsers = users.filter((_, i) => i !== index);
      setUsers(updatedUsers);
    }
  };

  const handleTogglePassword = (index) => {
    const updatedUsers = [...users];
    updatedUsers[index].showPassword = !updatedUsers[index].showPassword;
    setUsers(updatedUsers);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResults(null);

    // Validate that at least one user has all fields filled
    const validUsers = users.filter(
      (user) => user.username.trim() && user.mailadress.trim() && user.password
    );

    if (validUsers.length === 0) {
      showToast("Vennligst fyll ut minst én bruker", "error");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(API_ENDPOINTS.USER_MULTIPLE_CREATE, {
        users: validUsers,
      });

      setResults(response.data);

      if (response.data.success > 0) {
        showToast(
          `${response.data.success} bruker(e) opprettet!`,
          "success"
        );
      }

      if (response.data.errors && response.data.errors.length > 0) {
        response.data.errors.forEach((error) => {
          showToast(
            `Bruker ${error.username || `#${error.index + 1}`}: ${error.error}`,
            "error"
          );
        });
      }

      // Clear successfully created users
      if (response.data.results && response.data.results.length > 0) {
        const successfulUsernames = response.data.results.map((r) => r.username);
        const remainingUsers = users.filter(
          (user) => !successfulUsernames.includes(user.username.trim())
        );
        if (remainingUsers.length === 0) {
          setUsers([
            { username: "", mailadress: "", password: "", showPassword: false },
          ]);
        } else {
          setUsers(remainingUsers);
        }
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "En feil oppstod. Prøv igjen.";
      showToast(errorMessage, "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const navbarItems = [
    { to: "/home", label: "Hjem" },
    { to: "/signup", label: "Logg inn" },
  ];

  return (
    <div className={styles.pageWrapper}>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <Navbar items={navbarItems} />
      <div className={styles.pageContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h1 className={styles.cardTitle}>Opprett flere brukere</h1>
              <p className={styles.cardSubtitle}>
                Fyll ut informasjonen for hver bruker du vil opprette
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {users.map((user, index) => (
                <div key={index} className={styles.userCard}>
                  <div className={styles.userCardHeader}>
                    <h3 className={styles.userCardTitle}>
                      Bruker {index + 1}
                    </h3>
                    {users.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveUser(index)}
                        className={styles.removeButton}
                        aria-label="Fjern bruker"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor={`username-${index}`} className={styles.formLabel}>
                      Brukernavn
                    </label>
                    <input
                      type="text"
                      id={`username-${index}`}
                      name="username"
                      placeholder="Skriv inn brukernavn"
                      value={user.username}
                      onChange={(event) => handleChange(index, event)}
                      className={styles.formInput}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor={`mailadress-${index}`} className={styles.formLabel}>
                      E-postadresse
                    </label>
                    <input
                      type="email"
                      id={`mailadress-${index}`}
                      name="mailadress"
                      placeholder="skriv@inn.epost"
                      value={user.mailadress}
                      onChange={(event) => handleChange(index, event)}
                      className={styles.formInput}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor={`password-${index}`} className={styles.formLabel}>
                      Passord
                    </label>
                    <div className={styles.passwordInputWrapper}>
                      <input
                        type={user.showPassword ? "text" : "password"}
                        id={`password-${index}`}
                        name="password"
                        placeholder="Minimum 8 tegn"
                        value={user.password}
                        onChange={(event) => handleChange(index, event)}
                        className={styles.formInput}
                        minLength={8}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => handleTogglePassword(index)}
                        className={styles.passwordToggle}
                        aria-label={user.showPassword ? "Skjul passord" : "Vis passord"}
                      >
                        {user.showPassword ? "Skjul" : "Vis"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={handleAddUser}
                  className={styles.btnSecondary}
                >
                  + Legg til bruker
                </button>
                <button
                  type="submit"
                  className={styles.btnPrimary}
                  disabled={loading}
                >
                  {loading ? "Oppretter..." : "Opprett alle brukere"}
                </button>
              </div>
            </form>

            {results && (
              <div className={styles.results}>
                <h3 className={styles.resultsTitle}>Resultat</h3>
                {results.success > 0 && (
                  <div className={styles.successResults}>
                    <p className={styles.resultsSummary}>
                      ✅ {results.success} bruker(e) opprettet
                    </p>
                    <ul className={styles.resultsList}>
                      {results.results.map((result, index) => (
                        <li key={index} className={styles.successItem}>
                          {result.username} ({result.mailadress})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {results.errors && results.errors.length > 0 && (
                  <div className={styles.errorResults}>
                    <p className={styles.resultsSummary}>
                      ❌ {results.errors.length} feil
                    </p>
                    <ul className={styles.resultsList}>
                      {results.errors.map((error, index) => (
                        <li key={index} className={styles.errorItem}>
                          Bruker {error.username || `#${error.index + 1}`}:{" "}
                          {error.error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultipleUsers;
