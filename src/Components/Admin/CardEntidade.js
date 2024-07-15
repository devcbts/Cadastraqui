import React, { useEffect, useRef, useState } from "react";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { api } from "../../services/axios";

export default function CardEntidade({ entity }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [profilePhoto, setProfilePhoto] = useState(null)
  useEffect(() => {
    async function getProfilePhotoEntity() {
      const token = localStorage.getItem("token");

      try {
        const profilePhoto = await api.get(`/entities/profilePicture/${entity.user_id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        ;
        setProfilePhoto(profilePhoto.data.url);
        localStorage.setItem("profilePhoto", JSON.stringify(profilePhoto.data.url));

      } catch (err) {

      }
    }
    getProfilePhotoEntity()
  }, [])

  return (
    <Link to={`/admin/entidades/${entity.id}`}>
      <div className="edital-card">
        {profilePhoto ?
          <img src={profilePhoto}></img>
          : ''}
        <h2>{entity.name}</h2>
      </div>
    </Link>
  );
}
