import { useEffect, useState } from "react";
import React from "react";
import universityLogo from "../Assets/usp-logo.png";
import "./editalDescription.css";
import { useNavigate, useParams } from "react-router";
import { api } from "../services/axios";

const LevelType = [{
  value: 'BasicEducation', label: 'Educação Básica'
},
{
  value: 'HigherEducation', label: 'Educação superior'
}]
export default function EditalInscricaoFake() {
  const params = useParams()
  console.log(params);
  const navigate = useNavigate()
  const [announcementInfo, setAnnouncementInfo] = useState()
  const [profilePhoto, setProfilePhoto] = useState(null)
  useEffect(() => {
    async function fetchAnnouncements() {
      const token = localStorage.getItem("token")
      try {
        const response = await api.get(`/candidates/anouncements/${params.announcement_id}`, {
          headers: {
            'authorization': `Bearer ${token}`,
          }
        })
        // Pega todos os editais e armazena em um estado
        setAnnouncementInfo(response.data.announcements)
        console.log(response.data.announcements)
      } catch (err) {
        console.log(err)
      }
    }
    fetchAnnouncements()



  }, [])


  useEffect(() => {
    async function getProfilePhotoEntity() {
      const token = localStorage.getItem("token");

      try {
        const profilePhoto = await api.get(`/entities/profilePicture/${announcementInfo.entity.user_id}`, {
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
  }, [announcementInfo])



  const [educationLevelTranslation, setEducationLevelTranslation] = useState('');

  useEffect(() => {
    if (announcementInfo?.educationLevels) {
      const levelObj = LevelType.find(level => level.value === announcementInfo.educationLevels[0].level);
      const translation = levelObj ? levelObj.label : ''; // Usar apenas a propriedade 'label' do objeto
      setEducationLevelTranslation(translation);
    }
  }, [announcementInfo]);
  
  return (
    <div className="container-inscricao">
      <div className="school-logo">
        {profilePhoto ?
          <img src={profilePhoto} ></img>
          : <div className="skeleton skeleton-big-image" style={{ width: '200px' }} />}
      </div>
      <div className="descricao-edital">
        <h1>{announcementInfo ? announcementInfo.announcementName : ''}</h1>



        <h4>
          {announcementInfo ? announcementInfo.description : ''}
        </h4>
      </div>
      <div className="info-inscricao">
        <div>
          <h2>Vagas: {announcementInfo ? announcementInfo.educationLevels.map((level) => {
            return <>{level.availableCourses}/ </>
          }) : ''}</h2>
        </div>
        <h2>Escolaridade: {educationLevelTranslation}</h2>  
            </div>
    </div>
  );
}
