import React, { useEffect, useRef, useState } from "react";
import Card from "react-bootstrap/Card";
import "./edital.css";
import uspLogo from "../Assets/usp-logo.png";
import { formatDate } from "../utils/get-date-formatted";
import { Link } from "react-router-dom";
import { api } from "../services/axios";

export default function Edital(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [profilePhoto, setProfilePhoto] = useState(null)
  useEffect(() => {
    async function getProfilePhotoEntity() {
      const token = localStorage.getItem("token");

      try {
        const profilePhoto = await api.get(`/entities/profilePicture/${props.userId}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        ;
        setProfilePhoto(profilePhoto.data.url);

      } catch (err) {

      }
    }
    getProfilePhotoEntity()
  }, [props])
  const announcement = props.announcement

  const announcementDate = formatDate(announcement.closeDate)
  return (
    <Link to={`/candidato/edital/${announcement.id}`}>
      <div className="edital-card">
        <h3>Prazo: {announcementDate}</h3>
        {profilePhoto ?
          <img style={{ width: '50%', height: '70%', borderRadius: '50%', boxShadow: 'initial' }} src={profilePhoto}></img>
          : ''}
        <h2 style={{ height: '30%', maxWidth: '70%' }}>{announcement.announcementName}</h2>
      </div>
    </Link>
  );
}
