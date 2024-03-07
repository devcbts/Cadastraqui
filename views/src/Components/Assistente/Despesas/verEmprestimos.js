import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './cadastroDespesas.css'; // Adicione um arquivo CSS para estilizar o formulário
import Select from 'react-select';
import { api } from '../../../services/axios';
export default function VerEmprestimo({formData,id, candidate}) {
    /*const [formData, setFormData] = useState({
        familyMemberName: '',
        installmentValue: '',
        totalInstallments: '',
        paidInstallments: '',
        bankName: '',
    });*/

    const handleChange = (e) => {
        //setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        try {
            const response = await api.post(`/candidates/expenses/loan/${selectedFamilyMemberId}`, {
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
            // Trate a resposta conforme necessário
        } catch (error) {
            console.error(error.response?.data || error.message);
            // Trate o erro conforme necessário
        }
    };


    const [familyMembers, setFamilyMembers] = useState([]);
    const [selectedFamilyMemberId, setSelectedFamilyMemberId] = useState('');
    const [opcoes, setOpcoes] = useState([])
    const [candidato, setCandidato] = useState({ id: candidate.id, nome: candidate.name });

    useEffect(() => {
        setOpcoes([...familyMembers.map(m => ({ value: m.value, label: m.label, type: 'family' })),
        { value: candidato.id, label: candidato.nome, type: 'candidate' }])
        console.log(familyMembers)
    },[familyMembers])
    useEffect(() => {

        async function pegarFamiliares() {

            const token = localStorage.getItem('token');
            try {
                const response = await api.get(`/candidates/family-member/${id}`, {
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
        //setFormData({ ...formData, familyMemberName: selectedOption.label });
        //setSelectedFamilyMemberId(selectedOption.value);
    };


    return (
        <div className="fill-box">
            <form onSubmit={handleSubmit} id='survey-form'>
                <div className='survey-box'>
                    <label>Nome do Familiar:</label>
                    <Select
                        options={opcoes}
                        isDisabled
                        onChange={handleSelectChange}
                        value={opcoes.find(option => option.label === formData.familyMemberName)}
                        required
                    />
                </div>

                <div className='survey-box'>
                    <label>Valor da Parcela:</label>
                    <br />
                    <input type="number" name="installmentValue" value={formData.installmentValue} disabled onChange={handleChange} className='survey-control' required />
                </div>

                <div className='survey-box'>
                    <label>Total de Parcelas:</label>
                    <input type="number" name="totalInstallments" value={formData.totalInstallments} disabled onChange={handleChange} className='survey-control' required />
                </div>

                <div className='survey-box'>
                    <label>Parcelas Pagas:</label>
                    <input type="number" name="paidInstallments" value={formData.paidInstallments} disabled onChange={handleChange} className='survey-control' required />
                </div>

                <div className='survey-box'>
                    <label>Nome do Banco:</label>
                    <input type="text" name="bankName" value={formData.bankName} disabled onChange={handleChange} className='survey-control' required />
                </div>

            </form>
        </div>
    );
}
