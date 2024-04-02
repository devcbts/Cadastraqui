import React, { useEffect, useRef, useState } from "react";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { api } from "../../services/axios";
import { formatDate } from "../../utils/get-date-formatted";

export default function CardEdital({ announcement, entity }) {
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
                console.log(profilePhoto);
                setProfilePhoto(profilePhoto.data.url);
                localStorage.setItem("profilePhoto", JSON.stringify(profilePhoto.data.url));

            } catch (err) {

            }
        }
        getProfilePhotoEntity()
    }, [])
    const announcementDate = formatDate(announcement.announcementDate)

    return (

            <div className="edital-card" style={{borderColor: 'gray', borderStyle:"solid", borderWidth: '2px'}}>
            <h3>Prazo: {announcementDate}</h3>
            {profilePhoto ?
                <img src={profilePhoto}></img>
                : ''}
            <h2>{announcement.announcementName}</h2>
        </div>
    );
}
