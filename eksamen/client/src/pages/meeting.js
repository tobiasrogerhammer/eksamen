import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../meeting.module.css";
import { NavLink } from "react-router-dom";

function Meeting() {
  const [meetings, setMeetings] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    startTime: "",
    endTime: "",
    location: "",
    agenda: "",
    isCompleted: false,
  });
  const isAdmin = sessionStorage.getItem("isAdmin") === "true";

  const createMeeting = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:5000/meeting/create", formData);
      setFormData({
        title: "",
        startTime: "",
        endTime: "",
        location: "",
        agenda: "",
        isCompleted: false,
      });
      alert("Meeting created successfully!");
    } catch (err) {
      console.log(err);
      alert("Error creating meeting.");
    }
  };

  const updateMeetingStatus = async (meetingId, isChecked) => {
    if (!isAdmin) {
      alert("Only admins can update meeting status.");
      return;
    }
    try {
      await axios.put(`http://localhost:5000/meeting/update/${meetingId}`, {
        isCompleted: isChecked,
      });
      setMeetings((prevMeetings) =>
        prevMeetings.map((meeting) =>
          meeting._id === meetingId
            ? { ...meeting, isCompleted: isChecked }
            : meeting
        )
      );
      alert("Meeting status updated successfully!");
    } catch (err) {
      console.log(err);
      alert("Error updating meeting status.");
    }
  };

  const deleteMeeting = async (meetingId) => {
    try {
      await axios.delete(`http://localhost:5000/meeting/delete/${meetingId}`);
      setMeetings((prevMeetings) =>
        prevMeetings.filter((meeting) => meeting._id !== meetingId)
      );
      alert("Meeting deleted successfully!");
    } catch (err) {
      console.log(err);
      alert("Error deleting meeting.");
    }
  };

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get("http://localhost:5000/meeting/fetch");
        const meetings = response.data.map((meeting) => ({
          ...meeting,
        }));
        setMeetings(meetings);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMeetings();
    const intervalId = setInterval(fetchMeetings, 10000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className={styles.meeting}>
      <div className={styles.navbar}>
        <div className={styles.navItem}>
          <NavLink to="/home" className={styles.active}>
            Bølger&Skvalp
          </NavLink>
        </div>
        <div className={styles.navItem}>
          <NavLink to="/signup" className={styles.active}>
            Registrer deg
          </NavLink>
        </div>
        <div className={styles.navItem}>
          <NavLink to="/signup" className={styles.active}>
            Logg inn
          </NavLink>
        </div>
      </div>
      <div className={styles.meetingsMain}>
        <ul>
          {meetings.map((meeting, i) => (
            <li className={styles.meetingsList} key={i}>
              <h3>{meeting.title}</h3>
              <p>Start Time: {new Date(meeting.startTime).toLocaleString()}</p>
              <p>End Time: {new Date(meeting.endTime).toLocaleString()}</p>
              <p>Location: {meeting.location}</p>
              <p>Agenda: {meeting.agenda}</p>
              <p>
                Godkjent møte:{" "}
                {meeting.isCompleted ? <span> Ja</span> : <span>Nei</span>}
              </p>
              {isAdmin && (
                <label className={styles.approve}>
                  <input
                    type="checkbox"
                    checked={meeting.isCompleted}
                    onChange={(e) =>
                      updateMeetingStatus(meeting._id, e.target.checked)
                    }
                  />
                  Godkjenn møte
                </label>
              )}

              <button
                className={styles.delete}
                onClick={() => deleteMeeting(meeting._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <form className={styles.createMeeting} onSubmit={createMeeting}>
        <div>
          <h2>New Meeting</h2>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(event) =>
              setFormData({ ...formData, title: event.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="startTime">Start Time:</label>
          <input
            type="datetime-local"
            id="startTime"
            value={formData.startTime}
            onChange={(event) =>
              setFormData({ ...formData, startTime: event.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="endTime">End Time:</label>
          <input
            type="datetime-local"
            id="endTime"
            value={formData.endTime}
            onChange={(event) =>
              setFormData({ ...formData, endTime: event.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            value={formData.location}
            onChange={(event) =>
              setFormData({ ...formData, location: event.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="agenda">Agenda:</label>
          <textarea
            id="agenda"
            value={formData.agenda}
            onChange={(event) =>
              setFormData({ ...formData, agenda: event.target.value })
            }
          ></textarea>
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default Meeting;
