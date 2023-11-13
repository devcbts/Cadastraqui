import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { api } from '../../services/axios';
import './cadastroDespesas.css'; // Adicione um arquivo CSS para estilizar o formulário

export default function CadastroCartao() {
    const [formData, setFormData] = useState({
        familyMemberName: '',
        usersCount: 1, // Valor padrão
        cardType: '',
        bankName: '',
        cardFlag: '',
        invoiceValue: '',
    });

    const [familyMembers, setFamilyMembers] = useState([]);
    const [selectedFamilyMemberId, setSelectedFamilyMemberId] = useState('');

    useEffect(() => {
        async function pegarFamiliares() {
            const token = localStorage.getItem('token');
            try {
                const response = await api.get('/candidates/family-member', {
                    headers: { 'Authorization': `Bearer ${token}` }
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = selectedOption => {
        setFormData({ ...formData, familyMemberName: selectedOption.label });
        setSelectedFamilyMemberId(selectedOption.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        try {
            const response = await api.post(`/candidates/expenses/credit-card/${selectedFamilyMemberId}`, {
                familyMemberName: formData.familyMemberName,
                usersCount: Number(formData.usersCount), // Valor padrão
                cardType: formData.cardType,
                bankName: formData.bankName,
                cardFlag: formData.cardFlag,
                invoiceValue: Number(formData.invoiceValue)
            }, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            console.log(response.data);
            // Trate a resposta conforme necessário
        } catch (error) {
            console.error(error.response?.data || error.message);
            // Trate o erro conforme necessário
        }
    };

    return (
        <div className="fill-box">
            <form onSubmit={handleSubmit} id='survey-form'>
                {/* Seleção de familiar */}
                <div className='survey-box'>
                    <label>Nome do Familiar:</label>
                    <Select
                        options={familyMembers}
                        onChange={handleSelectChange}
                        value={familyMembers.find(option => option.label === formData.familyMemberName)}
                        required
                    />
                </div>

                {/* Outros campos do formulário */}
                <div className='survey-box'>
                    <label>Quantidade de Usuários:</label>
                    <input type="number" name="usersCount" value={formData.usersCount} className='survey-control' onChange={handleChange} required />
                </div>

                <div className='survey-box'>
                    <label>Tipo de Cartão:</label>
                    <input type="text" name="cardType" value={formData.cardType} className='survey-control' onChange={handleChange} required />
                </div>

                <div className='survey-box'>
                    <label>Nome do Banco:</label>
                    <input type="text" name="bankName" value={formData.bankName} className='survey-control' onChange={handleChange} required />
                </div>

                <div className='survey-box'>
                    <label>Bandeira do Cartão:</label>
                    <input type="text" name="cardFlag" value={formData.cardFlag} className='survey-control' onChange={handleChange} required />
                </div>

                <div className='survey-box'>
                    <label>Valor da Fatura:</label>
                    <input type="number" name="invoiceValue" value={formData.invoiceValue} className='survey-control' onChange={handleChange} required />
                </div>

                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}
