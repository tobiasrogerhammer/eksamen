import React, { useState } from "react";
import axios from "axios";
import styles from "../login.module.css";
import { API_ENDPOINTS } from "../config";
import Navbar from "../components/Navbar";

function Signup({ onSignup }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  const getPasswordStrength = (pwd) => {
    if (!pwd) return null;
    if (pwd.length < 6) return "weak";
    if (pwd.length < 10) return "medium";
    return "strong";
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (!username || !email || !password) {
      setError("Vennligst fyll ut alle felt");
      setLoading(false);
      return;
    }

    if (username.length < 3) {
      setError("Brukernavn må være minst 3 tegn");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Passord må være minst 8 tegn");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        API_ENDPOINTS.USER_CREATE,
        {
          username: username,
          mailadress: email,
          password: password,
        },
        { withCredentials: true }
      );

      if (response.data.exists) {
        setError("Brukernavn eller e-post er allerede i bruk");
        setLoading(false);
        return;
      }

      if (response.status === 200 || response.status === 201) {
        sessionStorage.setItem("username", username);
        window.location.href = "/userhome";
      }
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data?.error ||
          error.response.data?.message ||
          "Kunne ikke opprette bruker";
        setError(errorMessage);
        console.error("Signup error:", error.response.data);
      } else if (error.request) {
        setError("Nettverksfeil. Sjekk at serveren kjører.");
        console.error("Network error:", error.request);
      } else {
        setError("En uventet feil oppstod");
        console.error("Error:", error.message);
      }
      setLoading(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (!username || !password) {
      setError("Vennligst fyll ut alle felt");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.USER_LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("isAdmin", data.isAdmin);
        if (data.isAdmin) {
          window.location.href = "/adminpage";
        } else {
          window.location.href = "/userhome";
        }
        console.log("Login successful");
      } else {
        setError(data.error || "Innlogging feilet");
        setLoading(false);
        console.log("Login failed:", data.error || data);
      }
    } catch (error) {
      setError("Nettverksfeil. Sjekk at serveren kjører.");
      setLoading(false);
      console.error("Login error:", error);
    }
  };

  const navbarItems = [{ to: "/home", label: "Hjem" }];

  return (
    <div className={styles.login}>
      <Navbar items={navbarItems} />
      <div className={styles.loginWrapper}>
        <div className={styles.loginContent}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          {isRegistering ? (
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <header className={styles.formHeader}>
                <h2 className={styles.formTitle}>Registrer deg</h2>
                <p className={styles.formSubtitle}>
                  Opprett en konto for å komme i gang
                </p>
              </header>
              <div className={styles.formGroup}>
                <label htmlFor="username" className={styles.formLabel}>
                  Brukernavn:
                </label>
                <input
                  type="text"
                  id="username"
                  className={styles.formInput}
                  value={username}
                  onChange={handleUsernameChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.formLabel}>
                  E-post:
                </label>
                <input
                  type="email"
                  id="email"
                  className={styles.formInput}
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.formLabel}>
                  Passord:
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={styles.formInput}
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  minLength={8}
                  placeholder="Minimum 8 tegn"
                />
                <label className={styles.passwordToggleLabel}>
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className={styles.passwordToggleCheckbox}
                  />
                  <span className={styles.passwordToggleText}>
                    {showPassword ? "Skjul passord" : "Vis passord"}
                  </span>
                </label>
                {password && (
                  <div className={styles.passwordStrength}>
                    <div
                      className={`${styles.passwordStrengthBar} ${
                        passwordStrength ? styles[passwordStrength] : ""
                      }`}
                    />
                  </div>
                )}
              </div>
              <div className={styles.formActions}>
                <button
                  type="submit"
                  className={styles.btnSubmit}
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading ? "Oppretter..." : "Registrer deg"}
                </button>
                <a className={styles.link} href="/multipleUsers">
                  Opprett flere brukere
                </a>
              </div>
              <footer className={styles.formFooter}>
                <p
                  className={styles.toggleText}
                  onClick={() => setIsRegistering((value) => !value)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setIsRegistering((value) => !value);
                    }
                  }}
                >
                  Har du allerede en konto?{" "}
                  <span className={styles.toggleTextLink}>Logg inn her</span>
                </p>
              </footer>
            </form>
          ) : (
            <form onSubmit={handleLogin} className={styles.form} noValidate>
              <header className={styles.formHeader}>
                <h2 className={styles.formTitle}>Logg inn</h2>
                <p className={styles.formSubtitle}>
                  Velkommen tilbake! Logg inn på din konto
                </p>
              </header>
              <div className={styles.formGroup}>
                <label
                  htmlFor="login-username"
                  className={styles.formLabel}
                  data-testid="usernameLabel"
                >
                  Brukernavn:
                </label>
                <input
                  type="text"
                  id="login-username"
                  className={styles.formInput}
                  value={username}
                  onChange={handleUsernameChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="login-password" className={styles.formLabel}>
                  Passord:
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="login-password"
                  className={styles.formInput}
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                <label className={styles.passwordToggleLabel}>
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className={styles.passwordToggleCheckbox}
                  />
                  <span className={styles.passwordToggleText}>
                    {showPassword ? "Skjul passord" : "Vis passord"}
                  </span>
                </label>
              </div>
              <div className={styles.formActions}>
                <button
                  type="submit"
                  className={styles.btnSubmit}
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading ? "Logger inn..." : "Logg inn"}
                </button>
              </div>
              <footer className={styles.formFooter}>
                <p
                  className={styles.toggleText}
                  onClick={() => setIsRegistering((value) => !value)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setIsRegistering((value) => !value);
                    }
                  }}
                >
                  Har du ikke en konto?{" "}
                  <span className={styles.toggleTextLink}>
                    Registrer deg her
                  </span>
                </p>
              </footer>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Signup;
