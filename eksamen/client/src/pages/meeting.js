import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../meeting.module.css";
import { NavLink } from "react-router-dom";
import { API_ENDPOINTS } from "../config";
import { useToast, ToastContainer } from "../components/Toast";
import Navbar from "../components/Navbar";

function Meeting() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    startTime: "",
    endTime: "",
    location: "",
    agenda: "",
    isCompleted: false,
  });
  const isAdmin = sessionStorage.getItem("isAdmin") === "true";
  const { toasts, showToast, removeToast } = useToast();

  const createMeeting = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Client-side validation
    if (!formData.title.trim()) {
      showToast("Title is required", "error");
      setLoading(false);
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      showToast("Start time and end time are required", "error");
      setLoading(false);
      return;
    }

    if (new Date(formData.startTime) >= new Date(formData.endTime)) {
      showToast("Start time must be before end time", "error");
      setLoading(false);
      return;
    }

    if (!formData.location.trim()) {
      showToast("Location is required", "error");
      setLoading(false);
      return;
    }

    if (!formData.agenda.trim()) {
      showToast("Agenda is required", "error");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(API_ENDPOINTS.MEETING_CREATE, formData);
      setFormData({
        title: "",
        startTime: "",
        endTime: "",
        location: "",
        agenda: "",
        isCompleted: false,
      });
      showToast(
        response.data.message || "Meeting created successfully!",
        "success"
      );
      fetchMeetings(); // Refresh the list
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Error creating meeting";
      showToast(errorMessage, "error");
      console.error("Error creating meeting:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateMeetingStatus = async (meetingId, isChecked) => {
    if (!isAdmin) {
      showToast("Only admins can update meeting status", "warning");
      return;
    }

    try {
      const response = await axios.put(
        API_ENDPOINTS.MEETING_UPDATE(meetingId),
        {
          isCompleted: isChecked,
        }
      );
      setMeetings((prevMeetings) =>
        prevMeetings.map((meeting) =>
          meeting._id === meetingId
            ? { ...meeting, isCompleted: isChecked }
            : meeting
        )
      );
      showToast(
        response.data.message || "Meeting status updated successfully!",
        "success"
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Error updating meeting status";
      showToast(errorMessage, "error");
      console.error("Error updating meeting:", err);
    }
  };

  const deleteMeeting = async (meetingId) => {
    if (!window.confirm("Are you sure you want to delete this meeting?")) {
      return;
    }

    try {
      const response = await axios.delete(
        API_ENDPOINTS.MEETING_DELETE(meetingId)
      );
      setMeetings((prevMeetings) =>
        prevMeetings.filter((meeting) => meeting._id !== meetingId)
      );
      showToast(
        response.data.message || "Meeting deleted successfully!",
        "success"
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Error deleting meeting";
      showToast(errorMessage, "error");
      console.error("Error deleting meeting:", err);
    }
  };

  const fetchMeetings = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.MEETING_FETCH);
      const meetings = response.data.map((meeting) => ({
        ...meeting,
        startTime: new Date(meeting.startTime),
        endTime: new Date(meeting.endTime),
      }));
      setMeetings(meetings);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Error fetching meetings";
      showToast(errorMessage, "error");
      console.error("Error fetching meetings:", error);
    }
  };

  useEffect(() => {
    fetchMeetings();
    const intervalId = setInterval(fetchMeetings, 10000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const navbarItems = [
    { to: "/home", label: "Hjem" },
    { to: "/signup", label: "Registrer deg" },
    { to: "/signup", label: "Logg inn" },
  ];

  return (
    <div className={styles.meeting}>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <Navbar items={navbarItems} />
      <div className={styles.pageContainer}>
        <div className={styles.contentGrid}>
          <div className={styles.meetingsSection}>
            <h2 className={styles.sectionTitle}>Møter</h2>
            {meetings.length === 0 ? (
              <div className={styles.emptyState}>
                <p>Ingen møter planlagt ennå.</p>
              </div>
            ) : (
              <div className={styles.meetingsList}>
                {meetings.map((meeting) => (
                  <div
                    key={meeting._id}
                    className={`${styles.meetingItem} ${
                      meeting.isCompleted ? styles.completed : ""
                    }`}
                  >
                    <h3 className={styles.meetingTitle}>{meeting.title}</h3>
                    <div className={styles.meetingInfo}>
                      <div className={styles.meetingInfoItem}>
                        <span className={styles.meetingLabel}>Start:</span>
                        <span>{meeting.startTime.toLocaleString("no-NO")}</span>
                      </div>
                      <div className={styles.meetingInfoItem}>
                        <span className={styles.meetingLabel}>Slutt:</span>
                        <span>{meeting.endTime.toLocaleString("no-NO")}</span>
                      </div>
                      <div className={styles.meetingInfoItem}>
                        <span className={styles.meetingLabel}>Sted:</span>
                        <span>{meeting.location}</span>
                      </div>
                      <div className={styles.meetingInfoItem}>
                        <span className={styles.meetingLabel}>Agenda:</span>
                        <span>{meeting.agenda}</span>
                      </div>
                    </div>
                    <div className={styles.meetingStatus}>
                      <span
                        className={`${styles.statusBadge} ${
                          meeting.isCompleted
                            ? styles.completed
                            : styles.pending
                        }`}
                      >
                        {meeting.isCompleted ? "Godkjent" : "Venter"}
                      </span>
                    </div>
                    {isAdmin && (
                      <div className={styles.approve}>
                        <input
                          type="checkbox"
                          id={`approve-${meeting._id}`}
                          checked={meeting.isCompleted}
                          onChange={(e) =>
                            updateMeetingStatus(meeting._id, e.target.checked)
                          }
                        />
                        <label htmlFor={`approve-${meeting._id}`}>
                          Godkjenn møte
                        </label>
                      </div>
                    )}
                    <div className={styles.meetingActions}>
                      <button
                        className={styles.btnDelete}
                        onClick={() => deleteMeeting(meeting._id)}
                      >
                        Slett
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.createMeetingForm}>
            <div className={styles.formCard}>
              <h2 className={styles.formTitle}>Nytt møte</h2>
              <form className={styles.form} onSubmit={createMeeting}>
                <div className={styles.formGroup}>
                  <label htmlFor="title" className={styles.formLabel}>
                    Tittel:
                  </label>
                  <input
                    type="text"
                    id="title"
                    className={styles.formInput}
                    value={formData.title}
                    onChange={(event) =>
                      setFormData({ ...formData, title: event.target.value })
                    }
                    required
                    maxLength={200}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="startTime" className={styles.formLabel}>
                    Starttid:
                  </label>
                  <input
                    type="datetime-local"
                    id="startTime"
                    className={styles.formInput}
                    value={formData.startTime}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        startTime: event.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="endTime" className={styles.formLabel}>
                    Sluttid:
                  </label>
                  <input
                    type="datetime-local"
                    id="endTime"
                    className={styles.formInput}
                    value={formData.endTime}
                    onChange={(event) =>
                      setFormData({ ...formData, endTime: event.target.value })
                    }
                    required
                    min={formData.startTime}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="location" className={styles.formLabel}>
                    Sted:
                  </label>
                  <input
                    type="text"
                    id="location"
                    className={styles.formInput}
                    value={formData.location}
                    onChange={(event) =>
                      setFormData({ ...formData, location: event.target.value })
                    }
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="agenda" className={styles.formLabel}>
                    Agenda:
                  </label>
                  <textarea
                    id="agenda"
                    className={styles.formTextarea}
                    value={formData.agenda}
                    onChange={(event) =>
                      setFormData({ ...formData, agenda: event.target.value })
                    }
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className={styles.btnSubmit}
                  disabled={loading}
                >
                  {loading ? "Oppretter..." : "Opprett møte"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Meeting;
