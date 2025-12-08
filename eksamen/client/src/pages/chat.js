import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "../chat.module.css";
import { API_ENDPOINTS } from "../config";
import { useToast, ToastContainer } from "../components/Toast";
import Navbar from "../components/Navbar";

function ChatApp({ activeChatroom }) {
  const [newMessage, setNewMessage] = useState("");
  const [chatrooms, setChatrooms] = useState([]);
  const username = sessionStorage.getItem("username");
  const messagesEndRef = useRef();
  const [members, setMembers] = useState([]);
  const { toasts, showToast, removeToast } = useToast();

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
      await axios.post(API_ENDPOINTS.CHAT_CREATE, message);
      setNewMessage("");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Error sending message";
      showToast(errorMessage, "error");
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.CHAT_MESSAGES);
        const messages = response.data.map((message) => ({
          ...message,
          time: new Date(message.time).toLocaleString(),
        }));
        setChatrooms([{ id: activeChatroom, messages }]);
        if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "instant" });
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "Error fetching messages";
        showToast(errorMessage, "error");
        console.error("Error fetching messages:", error);
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
        const response = await axios.get(API_ENDPOINTS.USER_HUDDLY);
        const users = response.data.map((username) => ({
          ...username,
        }));
        setMembers(users);
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "Error fetching users";
        showToast(errorMessage, "error");
        console.error("Error fetching users:", error);
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

  const navbarItems = [
    { to: "/userhome", label: "Hjem" },
    { to: "/chat", label: "Chat" },
    { to: "/signup", label: "Logg ut" },
  ];

  return (
    <div className={styles.chatApp}>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <Navbar items={navbarItems} />
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
