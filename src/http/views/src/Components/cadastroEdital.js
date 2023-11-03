import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { api } from '../services/axios';
import PdfPreview from './pdfPreview';

export default function CadastroEdital() {

    const [announcementType, setAnnouncementType] = useState(""); // Initial value can be set to default if needed.
    const [educationLevel, setEducationLevel] = useState("");
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [offeredVancancies, setOfferedVancancies] = useState(0)
    const [verifiedScholarships, setVerifiedScholarships] = useState(0)
    const [announcementDate, setAnnouncementDate] = useState(new Date().toISOString().split('T')[0])
    const [description, setDescription] = useState('')
    const [announcementName, setAnnouncementName] = useState('')
    const [filePdf, setFilePdf] = useState(null)

    function handleChange(event) {
        setFile(event.target.files[0]);
        const fileInput = event.target;
        const label = document.querySelector(".file-label");

        if (fileInput.files && fileInput.files.length > 0) {
            // If there's a file attached, update label text with file name
            label.textContent = "Alterar arquivo";
        } else {
            // If no file is attached, revert back to default label text
            label.textContent = "Selecione um arquivo";
        }
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file)
            reader.onload = (e) => {
                // Converte o ArrayBuffer para um Uint8Array
                setFilePdf(e.target.result); // Atualiza o estado com o Uint8Array
            };
        }
    }
    // Set announcement type according to the option selected
    const handleAnnouncementTypeChange = (e) => {
        setAnnouncementType(e.target.value);
    };

    // Set announcement ed. level according to the option selected
    const handleEducationLevelChange = (e) => {
        setEducationLevel(e.target.value);
    };

    // BackEnd Functions
    async function CreateAnnouncement() {

    }

    async function handleSubmit(event) {
        event.preventDefault();
        const data = {
            entityChanged: false,
            branchChanged: false,
            announcementType: announcementType,
            announcementDate: announcementDate,
            announcementName: announcementName,
            offeredVacancies: offeredVancancies,
            verifiedScholarships: verifiedScholarships,
            description: description
        }
        console.log('====================================');
        console.log(data);
        console.log('====================================');
        const token = localStorage.getItem("token");
        try {
            const response = await api.post("/entities/announcement", {
                entityChanged: false,
                branchChanged: false,
                announcementType: announcementType,
                announcementDate: announcementDate,
                announcementName: announcementName,
                offeredVacancies: offeredVancancies,
                verifiedScholarships: verifiedScholarships,
                description: description,

            },
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            )

            const announcement = response.data.announcement



            if (file) {

                try {
                    const formData = new FormData();
                    formData.append("file", file);
                    await api.post(`/entities/announcement/${announcement.id}`, formData, {
                        headers: {
                            authorization: `Bearer ${token}`,
                        },
                    });
                } catch (err) {
                    alert("Erro ao atualizar foto de perfil.");
                    console.log(err);
                }
            }
        } catch (err) {
            alert("Erro ao atualizar foto de perfil.");
            console.log(err);
        }
    }

    return (
        <div> <div className="container-cadastros">
            <div className="novo-cadastro">
                <form
                    id="contact"
                    action=""
                    method="post"
                    onSubmit={handleSubmit}
                >
                    <h3>Informações do edital</h3>
                    <h4>Preencha as informações abaixo para realizar o cadastro</h4>

                    <fieldset>
                        <select
                            value={announcementType}
                            onChange={handleAnnouncementTypeChange}
                        >
                            <option value="" disabled>
                                Selecionar o tipo de edital
                            </option>
                            <option value="ScholarshipGrant">Scholarship Grant</option>
                            <option value="PeriodicVerification">
                                Periodic Verification
                            </option>
                        </select>
                    </fieldset>

                    <fieldset>
                        <select
                            value={educationLevel}
                            onChange={handleEducationLevelChange}
                        >
                            <option value="" disabled>
                                Selecionar o nível de ensino
                            </option>
                            <option value="higherEducation">Ensino Superior</option>
                            <option value="basicEducation">Ensino Básico</option>
                        </select>
                    </fieldset>

                    <fieldset>
                        <label for="nome-edital">Número do edital</label>
                        <input
                            placeholder="Exemplo: 2023.1"
                            type="text"
                            tabindex="1"
                            id="nome-edital"
                            required
                            autofocus
                            value={announcementName}
                            onChange={(e) => setAnnouncementName(e.target.value)}
                        />
                    </fieldset>
                    <fieldset>
                        <label for="email-institucional">
                            Data limite para inscrição
                        </label>
                        <input
                            placeholder="Exemplo: 10/11/2023"
                            type="date"
                            tabindex="2"
                            id="email-institucional"
                            required
                            value={announcementDate}
                            onChange={(e) => setAnnouncementDate(e.target.value)}
                        />
                    </fieldset>
                    <fieldset>
                        <label for="nome-edital">Número de total de vagas</label>
                        <input
                            placeholder="Exemplo: 10"
                            type="number"
                            tabindex="3"
                            required
                            value={offeredVancancies}
                            onChange={(e) => setOfferedVancancies(Number(e.target.value))}
                        />
                    </fieldset>
                    <fieldset>
                        <label for="nome-edital">Número de total de bolsas</label>
                        <input
                            placeholder="Exemplo: 7"
                            type="number"
                            tabindex="3"
                            required
                            value={verifiedScholarships}
                            onChange={(e) => setVerifiedScholarships(Number(e.target.value))}
                        />
                    </fieldset>
                    <fieldset className="file-div">
                        <label
                            for="edital-pdf"
                            className="file-label"
                            id="label-file"
                        >
                            Fazer upload do PDF do Edital
                        </label>
                        <div className="upload">
                            <input
                                type="file"
                                id="edital-pdf"
                                title="Escolher arquivo"
                                onChange={handleChange}
                            />
                        </div>
                        {filePdf ?
                            <PdfPreview file={filePdf} /> : ''}
                    </fieldset>
                    <fieldset>
                        <textarea
                            placeholder="Descrição"
                            tabindex="5"
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </fieldset>

                    <fieldset>
                        <button
                            name="submit"
                            type="submit"
                            id="contact-submit"
                            data-submit="...Sending"
                            onClick={CreateAnnouncement}
                        >
                            Cadastrar
                        </button>
                    </fieldset>
                </form>
            </div>
        </div></div>
    )
}

