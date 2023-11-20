import React from 'react'

export default function VerAcoesPosteriores({ applications }) {
    return (
        <div className="fill-container general-info">
            <table>
                <thead>
                    <tr>
                        <th>Ano</th>
                        <th>Edital</th>
                        <th>Matriz/Filial</th>
                        <th>Curso</th>
                        <th>Turno</th>
                        <th>Assistente Social</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map((application) => {
                        return (
                            <tr>
                                <td>
                                    <strong>{application.announcement.anouncementDate}</strong>
                                </td>
                                <td>{application.announcement.anouncementName}</td>
                                <td>Itajubá</td>
                                <td>{application.EducationLevel.availableCourses}</td>
                                <td>{application.EducationLevel.shift}</td>
                                <td>{application.SocialAssistantName}</td>
                            </tr>
                        )
                    })}

                 
                </tbody>
            </table>
        </div>
    )
}

