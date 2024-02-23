import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './cadastroDespesas.css'; // Adicione um arquivo CSS para estilizar o formulário
import { api } from '../../services/axios';
import Select from 'react-select';
export default function VerEmprestimo({formDataInfo}) {
    const [formData, setFormData] = useState(formDataInfo)
    const [isEditing, setIsEditing] = useState(false)

    function toggleEdit() {
        setIsEditing(!isEditing); // Alterna o estado de edição
    }
    useEffect(() => {
        setFormData(formDataInfo)
        setIsEditing(false)
    },formDataInfo)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        const token = localStorage.getItem('token');
        try {
            const response = await api.patch(`/candidates/expenses/loan/${formData.familyMember_id}`, {
                id: formData.id,
                familyMemberName: formData.familyMemberName,
                installmentValue: Number(formData.installmentValue),
                totalInstallments: Number(formData.totalInstallments),
                paidInstallments: Number(formData.paidInstallments),
                bankName: formData.bankName,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },

            });
            console.log(response.data);
            setIsEditing(false)
            // Trate a resposta conforme necessário
        } catch (error) {
            alert(error.message)
            console.error(error.response?.data || error.message);
            // Trate o erro conforme necessário
        }
    };


    const [familyMembers, setFamilyMembers] = useState([]);
    const [selectedFamilyMemberId, setSelectedFamilyMemberId] = useState('');

    useEffect(() => {

        async function pegarFamiliares() {

            const token = localStorage.getItem('token');
            try {
                const response = await api.get('/candidates/family-member', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                },)

                setFamilyMembers(response.data.familyMembers.map(member => ({
                    value: member.id,
                    label: member.fullName,
                })));
            } catch (error) {

            }
        }
        pegarFamiliares()
    }, [])

    const handleSelectChange = selectedOption => {
        setFormData({ ...formData, familyMemberName: selectedOption.label });
        setSelectedFamilyMemberId(selectedOption.value);
    };


    return (
        <div className="fill-box">
            <form onSubmit={handleSubmit} id='survey-form'>
                <div className='survey-box'>
                    <label>Nome do Familiar:</label>
                    <Select
                        options={familyMembers}
                        isDisabled={!isEditing}
                        onChange={handleSelectChange}
                        value={familyMembers.find(option => option.label === formData.familyMemberName)}
                        required
                    />
                </div>

                <div className='survey-box'>
                    <label>Valor da Parcela:</label>
                    <br />
                    <input type="number" name="installmentValue" value={formData.installmentValue} disabled={!isEditing} onChange={handleChange} className='survey-control' required />
                </div>

                <div className='survey-box'>
                    <label>Total de Parcelas:</label>
                    <input type="number" name="totalInstallments" value={formData.totalInstallments} disabled={!isEditing} onChange={handleChange} className='survey-control' required />
                </div>

                <div className='survey-box'>
                    <label>Parcelas Pagas:</label>
                    <input type="number" name="paidInstallments" value={formData.paidInstallments} disabled={!isEditing} onChange={handleChange} className='survey-control' required />
                </div>

                <div className='survey-box'>
                    <label>Nome do Banco:</label>
                    <input type="text" name="bankName" value={formData.bankName} disabled={!isEditing} onChange={handleChange} className='survey-control' required />
                </div>

  
                <div className="survey-box">
                    {!isEditing ? (
                        <button className="over-button" type="button" onClick={toggleEdit}>Editar</button>
                    ) : (
                        <>
                            <button className="over-button" type="button" onClick={handleSubmit}>Salvar Dados</button>
                            <button  className="over-button"type="button" onClick={toggleEdit}>Cancelar</button>
                        </>
                    )}
                </div>            </form>
        </div>
    );
}
