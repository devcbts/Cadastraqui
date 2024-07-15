import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import './cadastroDespesas.css'; // Adicione um arquivo CSS para estilizar o formulário
import { api } from '../../../services/axios';
import { formatCurrency } from '../../../utils/format-currency';

export default function VerCartao({ formData, id, candidate }) {
    /* const [formData, setFormData] = useState({
         familyMemberName: '',
         usersCount: 1, // Valor padrão
         cardType: '',
         bankName: '',
         cardFlag: '',
         invoiceValue: '',
     });*/

    const [familyMembers, setFamilyMembers] = useState([]);
    const [selectedFamilyMemberId, setSelectedFamilyMemberId] = useState('');

    useEffect(() => {
        async function pegarFamiliares() {
            const token = localStorage.getItem('token');
            try {
                const response = await api.get(`/candidates/family-member/${id}`, {
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
        //setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = selectedOption => {
        //  setFormData({ ...formData, familyMemberName: selectedOption.label });
        setSelectedFamilyMemberId(selectedOption.value);
    };

    const [opcoes, setOpcoes] = useState([])
    const [candidato, setCandidato] = useState({ id: candidate.id, nome: candidate.name });

    useEffect(() => {
        setOpcoes([...familyMembers.map(m => ({ value: m.value, label: m.label, type: 'family' })),
        { value: candidato.id, label: candidato.nome, type: 'candidate' }])

    }, [familyMembers])

    return (
        <div className="fill-box">
            <form id='survey-form'>
                {/* Seleção de familiar */}
                <div className='survey-box'>
                    <label>Nome do Familiar:</label>
                    <Select
                        options={opcoes}
                        disabled onChange={handleSelectChange}
                        value={opcoes.find(option => option.label === formData.familyMemberName)}
                        required
                    />
                </div>

                {/* Outros campos do formulário */}
                <div className='survey-box'>
                    <label>Quantidade de Usuários:</label>
                    <input type="number" name="usersCount" value={formData.usersCount} className='survey-control' disabled onChange={handleChange} required />
                </div>

                <div className='survey-box'>
                    <label>Tipo de Cartão:</label>
                    <input type="text" name="cardType" value={formData.cardType} className='survey-control' disabled onChange={handleChange} required />
                </div>

                <div className='survey-box'>
                    <label>Nome do Banco:</label>
                    <input type="text" name="bankName" value={formData.bankName} className='survey-control' disabled onChange={handleChange} required />
                </div>

                <div className='survey-box'>
                    <label>Bandeira do Cartão:</label>
                    <input type="text" name="cardFlag" value={formData.cardFlag} className='survey-control' disabled onChange={handleChange} required />
                </div>

                <div className='survey-box'>
                    <label>Valor da Fatura:</label>
                    <input type="text" name="invoiceValue" value={formatCurrency(formData.invoiceValue)} className='survey-control' disabled onChange={handleChange} required />
                </div>

            </form>
        </div>
    );
}
