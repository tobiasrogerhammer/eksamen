import React, { useState } from "react";
import axios from "axios";
import styles from "../login.module.css";
import { NavLink } from "react-router-dom";

function Signup({ onSignup }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/user/create",
        {
          username: username,
          mailadress: email,
          password: password,
        },
        { withCredentials: true }
      );
      if (response.data.exists) {
        setError("Username or email already taken");
      }
      if (response.status === 200) {
        sessionStorage.setItem("username", username);
        window.location.href = "/userhome";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const response = await fetch("http://localhost:5000/user/login", {
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
        // Redirect to admin page
        window.location.href = "/adminpage";
      } else {
        // Redirect to user home page
        window.location.href = "/userhome";
      }
      console.log("Login successful");
    } else {
      console.log("Login failed");
    }
  };

  return (
    <div className={styles.login}>
      {error && <p>{error}</p>}
      {isRegistering ? (
        <div>
          <div className={styles.navbar}>
            <div className={styles.navItem}>
              <NavLink to="/home" className={styles.active}>
                Bølger&Skvalp
              </NavLink>
            </div>
            <div className={styles.navItem}>
              <NavLink to="/login" className={styles.active}>
                Logg inn
              </NavLink>
            </div>
          </div>
          <h1>Bølger og skvalp</h1>
          <form onSubmit={handleSubmit}>
            <h2>Sign up</h2>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
              />
            </label>
            <br />
            <label>
              Email:
              <input type="email" value={email} onChange={handleEmailChange} />
            </label>
            <br />
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
              />
            </label>
            <br />
            <button type="submit">Sign up</button>
            <a className={styles.link} href="/multipleUsers">
              Create more users
            </a>
            <p onClick={() => setIsRegistering((value) => !value)}>
              Login here
            </p>
          </form>
        </div>
      ) : (
        <div>
          <div className={styles.navbar}>
            <div className={styles.navItem}>
              <NavLink to="/home" className={styles.active}>
                Bølger&Skvalp
              </NavLink>
            </div>
            <div className={styles.navItem}>
              <NavLink to="/signup" className={styles.active}>
                Logg inn
              </NavLink>
            </div>
          </div>
          <h1>Bølger og skvalp</h1>
          <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <label data-testid="usernameLabel">
              Username:
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
              />
            </label>
            <br />
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
              />
            </label>
            <br />
            <button type="submit">Login</button>
            <p onClick={() => setIsRegistering((value) => !value)}>
              Create user here
            </p>
          </form>
        </div>
      )}
    </div>
  );
}

export default Signup;
