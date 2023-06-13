import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "../chat.module.css";

function ChatApp({ activeChatroom }) {
  const [newMessage, setNewMessage] = useState("");
  const [chatrooms, setChatrooms] = useState([]);
  const username = sessionStorage.getItem("username");
  const messagesEndRef = useRef();
  const [members, setMembers] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newMessage.trim() === "") {
      return;
    }
    const timestamp = new Date().toLocaleString();
    const message = {
      username: username,
      message: newMessage,
      time: timestamp,
    };
    try {
      axios.post("http://localhost:5000/get/create", message);
    } catch (error) {
      console.log(error);
    }
    setNewMessage("");
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("http://localhost:5000/get/messages");
        const messages = response.data.map((message) => ({
          ...message,
          time: new Date(message.time).toLocaleString(),
        }));
        setChatrooms([{ id: activeChatroom, messages }]);
        messagesEndRef.current.scrollIntoView({ behavior: "instant" });
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
    const intervalId = setInterval(fetchMessages, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [activeChatroom]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/user/huddly");
        const users = response.data.map((username) => ({
          ...username,
        }));
        setMembers(users);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
    const intervalId = setInterval(fetchUsers, 10000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  function logout() {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("isAdmin");
  }

  return (
    <div className={styles.chatApp}>
      <div className={styles.navbar}>
        <div className={styles.navHome}>
          <a href="/home">Bølger&Skvalp</a>
        </div>
        <div className={styles.signup}>
          <a href="/signup">Registrer deg</a>
        </div>
        <div className={styles.login}>
          <a href="/login">Logg inn</a>
        </div>
      </div>
      <div className={styles.sidebar}>
        <div className={styles.members}>
          <h2 className={styles.chatHeader}>Bølger og Skvalp medlemmer:</h2>
          <ul>
            {members.map((member, i) => (
              <li key={i}>{member.username}</li>
            ))}
          </ul>
        </div>
        <button className={styles.logout} onClick={logout}>
          <a href="/signup">Logout</a>
        </button>
      </div>
      <div className={styles.chatMain}>
        <h2 className={styles.chatHeader}>{activeChatroom} Huddly:</h2>
        <div className={styles.chatBody}>
          {chatrooms.map((chatroom) =>
            chatroom.messages.map((message, index) => (
              <div
                id={"msg" + index}
                className={styles.messageList}
                key={index}
              >
                <div>
                  <strong>{message.username}:</strong>
                  <p className={styles.chatstyle}>
                    {message.message}
                    <span>{message.time}</span>
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <form className={styles.chatFooter} onSubmit={handleSubmit}>
          <div className={styles.inputContainer}>
            <label htmlFor="newMessage">New message:</label>
            <input
              type="text"
              id="newMessage"
              value={newMessage}
              onChange={(event) => setNewMessage(event.target.value)}
            />
            <button className={styles.sendMessage} type="submit">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatApp;
