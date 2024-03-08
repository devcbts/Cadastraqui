import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { api } from '../../services/axios';
import './cadastroDespesas.css'; // Adicione um arquivo CSS para estilizar o formulário
import { handleSuccess } from '../../ErrorHandling/handleSuceess';
import { handleAuthError } from '../../ErrorHandling/handleError';

export default function VerCartao({formDataInfo, candidate}) {
    const [formData, setFormData] = useState(formDataInfo);
    const [candidato, setCandidato] = useState({ id: candidate.id, nome: candidate.name });

    const [familyMembers, setFamilyMembers] = useState([]);
    const [selectedFamilyMemberId, setSelectedFamilyMemberId] = useState('');
    const [isEditing, setIsEditing] = useState(false)
    function toggleEdit() {
        setIsEditing(!isEditing); // Alterna o estado de edição
    }
    useEffect(() => {
        setFormData(formDataInfo)
        setIsEditing(false)
    },[formDataInfo])
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
            const response = await api.patch(`/candidates/expenses/credit-card`, {
                id: formData.id,
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
            handleSuccess(response, 'Dados Atualizados com sucesso!')
            setIsEditing(false)
            // Trate a resposta conforme necessário
        } catch (error) {
            handleAuthError(error)
            console.error(error.response?.data || error.message);
            // Trate o erro conforme necessário
        }
    };
    const [opcoes, setOpcoes] = useState([])

    useEffect(() => {
        setOpcoes([...familyMembers.map(m => ({ value: m.value, label: m.label, type: 'family' })),
        { value: candidato.id, label: candidato.nome, type: 'candidate' }])
        console.log(familyMembers)
    },[familyMembers])

    return (
        <div className="fill-box">
            <form onSubmit={handleSubmit} id='survey-form'>
                {/* Seleção de familiar */}
                <div className='survey-box'>
                    <label>Nome do Familiar:</label>
                    <Select
                        options={opcoes}
                        isDisabled={!isEditing} onChange={handleSelectChange}
                        value={opcoes.find(option => option.label === formData.familyMemberName)}
                        required
                    />
                </div>

                {/* Outros campos do formulário */}
                <div className='survey-box'>
                    <label>Quantidade de Usuários:</label>
                    <input type="number" name="usersCount" value={formData.usersCount} className='survey-control' disabled={!isEditing} onChange={handleChange} required />
                </div>

                <div className='survey-box'>
                    <label>Tipo de Cartão:</label>
                    <input type="text" name="cardType" value={formData.cardType} className='survey-control' disabled={!isEditing} onChange={handleChange} required />
                </div>

                <div className='survey-box'>
                    <label>Nome do Banco:</label>
                    <input type="text" name="bankName" value={formData.bankName} className='survey-control' disabled={!isEditing} onChange={handleChange} required />
                </div>

                <div className='survey-box'>
                    <label>Bandeira do Cartão:</label>
                    <input type="text" name="cardFlag" value={formData.cardFlag} className='survey-control' disabled={!isEditing} onChange={handleChange} required />
                </div>

                <div className='survey-box'>
                    <label>Valor da Fatura:</label>
                    <input type="number" name="invoiceValue" value={formData.invoiceValue} className='survey-control' disabled={!isEditing} onChange={handleChange} required />
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
                </div>             </form>
        </div>
    );
}
