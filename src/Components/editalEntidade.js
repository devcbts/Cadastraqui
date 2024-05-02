import React, { useEffect, useRef, useState } from "react";
import Card from "react-bootstrap/Card";
import "./edital.css";
import uspLogo from "../Assets/usp-logo.png";
import { formatDate } from "../utils/get-date-formatted";
import { Link } from "react-router-dom";
import { api } from "../services/axios";
export default function EditalEntidade({ announcement }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [profilePhoto, setProfilePhoto] = useState(null)
  useEffect(() => {
    async function getProfilePhotoEntity() {
      const token = localStorage.getItem("token");

      try {
        const profilePhoto = await api.get(`/entities/profilePicture/${announcement.entity.user_id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        console.log(profilePhoto);
        setProfilePhoto(profilePhoto.data.url);
        localStorage.setItem("profilePhoto", JSON.stringify(profilePhoto.data.url));

      } catch (err) {

      }
    }
    getProfilePhotoEntity()
  }, [])

  const getAnnouncementDeadlineIndicator = () => {
    const { closeDate } = announcement
    const deadlineDate = new Date(closeDate)
    // get current time (ms) diff
    const absTimeDiff = deadlineDate.getTime() - new Date().getTime()
    // transform into days diff
    const diff = absTimeDiff / (1000 * 60 * 60 * 24);
    const diffInDays = Math.round(diff)
    if (diffInDays >= 15) {
      return "green"
    }
    if (diffInDays > 0 && diffInDays <= 7) {
      return "orange"
    }
    if (diffInDays <= 0) {
      return "red"
    }
    return Math.round(diff)
  }
  const announcementDate = formatDate(announcement.closeDate)
  return (
    <Link to={`/entidade/edital/${announcement.id}`}>
      <div className="edital-card">
        <h3 style={{ color: getAnnouncementDeadlineIndicator() }}>Prazo: {announcementDate}</h3>
        {profilePhoto ?
          <img src={profilePhoto}></img>
          : ''}
        <h2>{announcement.announcementName}</h2>
      </div>
    </Link>
  );
}
