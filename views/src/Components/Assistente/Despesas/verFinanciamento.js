import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './cadastroDespesas.css'; // Adicione um arquivo CSS para estilizar o formulário
import Select from 'react-select';
import { api } from '../../../services/axios';
import { formatCurrency } from '../../../utils/format-currency';

export default function VerFinanciamento({ formData,id , candidate}) {
    /*
    const [formData, setFormData] = useState({
        familyMemberName: '',
        financingType: 'House_Apartment_Land', // Valor padrão
        otherFinancing: '',
        installmentValue: '',
        totalInstallments: '',
        paidInstallments: '',
        bankName: '',
    });
*/
    const handleChange = (e) => {
        //  setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        try {
            const response = await api.post(`/candidates/expenses/financing/${selectedFamilyMemberId}`, {
                familyMemberName: formData.familyMemberName,
                financingType: formData.financingType, // Valor padrão
                otherFinancing: formData.otherFinancing || undefined,
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
                });
                setFamilyMembers(response.data.familyMembers.map(member => ({
                    value: member.id,
                    label: member.fullName,
                })));
            } catch (error) {
                // Trate o erro conforme necessário
            }
        }
        pegarFamiliares();
    }, []);

    const handleSelectChange = selectedOption => {
       // setFormData({ ...formData, familyMemberName: selectedOption.label });
        //setSelectedFamilyMemberId(selectedOption.value);
    };

    const financingTypes = [
        { value: 'Car', label: 'Carro' },
        { value: 'Motorcycle', label: 'Moto' },
        { value: 'Truck', label: 'Caminhão' },
        { value: 'House_Apartment_Land', label: 'Casa/Apartamento/Terreno' },
        { value: 'Other', label: 'Outro' },
    ];

    return (
        <div className="fill-box">
            <form onSubmit={handleSubmit} id='survey-form'>
                {/* ... campos do formulário ... */}
                <div className='survey-box'>
                    <label>Tipo de Financiamento:</label>
                    <Select
                        options={financingTypes}
                        disabled 
                        //onChange={e => setFormData({ ...formData, financingType: e.value })}
                        value={financingTypes.find(option => option.value === formData.financingType)}
                        required
                    />
                </div>

                {formData.financingType === 'Other' && (
                    <div className='survey-box'>
                        <label>Outro Tipo de Financiamento:</label>
                        <input type="text" name="otherFinancing" value={formData.otherFinancing} disabled onChange={handleChange} className='survey-control' />
                    </div>
                )}

                <div className='survey-box'>
                    <label>Nome do Familiar:</label>
                    <Select
                        options={opcoes}
                        disabled onChange={handleSelectChange}
                        value={opcoes.find(option => option.label === formData.familyMemberName)}
                        required
                    />
                </div>

                <div className='survey-box'>
                    <label>Valor da Parcela:</label>
                    <input type="text" name="installmentValue" value={formatCurrency(formData.installmentValue)} disabled onChange={handleChange} className='survey-control' required />
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
