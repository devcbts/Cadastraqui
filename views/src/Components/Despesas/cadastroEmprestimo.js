import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './cadastroDespesas.css'; // Adicione um arquivo CSS para estilizar o formulário
import { api } from '../../services/axios';
import Select from 'react-select';
import { handleSuccess } from '../../ErrorHandling/handleSuceess';
import { handleAuthError } from '../../ErrorHandling/handleError';
export default function CadastroEmprestimo() {
    const [formData, setFormData] = useState({
        familyMemberName: '',
        installmentValue: '',
        totalInstallments: '',
        paidInstallments: '',
        bankName: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
            handleSuccess(response,"Dados cadastrados com sucesso!")

            // Trate a resposta conforme necessário
        } catch (error) {
            handleAuthError(error)
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
    },[])

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
                        onChange={handleSelectChange}
                        value={familyMembers.find(option => option.label === formData.familyMemberName)}
                         required
                    />
                </div>

                <div className='survey-box'>
                    <label>Valor da Parcela:</label>
                    <br/>
                    <input type="number" name="installmentValue" value={formData.installmentValue} onChange={handleChange} className='survey-control' required />
                </div>

                <div className='survey-box'>
                    <label>Total de Parcelas:</label>
                    <input type="number" name="totalInstallments" value={formData.totalInstallments} onChange={handleChange} className='survey-control' required />
                </div>

                <div className='survey-box'>
                    <label>Parcelas Pagas:</label>
                    <input type="number" name="paidInstallments" value={formData.paidInstallments} onChange={handleChange} className='survey-control' required />
                </div>

                <div className='survey-box'>
                    <label>Nome do Banco:</label>
                    <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} className='survey-control' required />
                </div>

                <button type="submit" >Enviar</button>
            </form>
        </div>
    );
}
