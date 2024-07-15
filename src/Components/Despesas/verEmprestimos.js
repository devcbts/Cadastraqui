import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './cadastroDespesas.css'; // Adicione um arquivo CSS para estilizar o formulário
import { api } from '../../services/axios';
import Select from 'react-select';
import { handleAuthError } from '../../ErrorHandling/handleError';
import { handleSuccess } from '../../ErrorHandling/handleSuceess';
export default function VerEmprestimo({ formDataInfo, candidate }) {
    const [formData, setFormData] = useState(formDataInfo)
    const [isEditing, setIsEditing] = useState(false)
    const [candidato, setCandidato] = useState({ id: candidate.id, nome: candidate.name });

    function toggleEdit() {
        setIsEditing(!isEditing); // Alterna o estado de edição
    }
    useEffect(() => {
        setFormData(formDataInfo)
        setIsEditing(false)
    }, [formDataInfo])

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "installmentValue") {
            // Extrai números e vírgula, substitui vírgula por ponto para conversão.
            const numericValue = parseFloat(value.replace(/\D/g, '').replace(/(\d)(\d{2})$/, '$1.$2')) || '';
            // Armazena o valor numérico no estado para envio ao backend.
            setFormData({ ...formData, [name]: numericValue });
        } else {
            // Para outros campos, atualiza o estado diretamente com o valor.
            setFormData({ ...formData, [name]: value });
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

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
            ;
            setIsEditing(false)
            handleSuccess(response, 'Dados Atualizados com sucesso!')

            // Trate a resposta conforme necessário
        } catch (error) {
            handleAuthError(error)
            console.error(error.response?.data || error.message);
            // Trate o erro conforme necessário
        }
    };


    const [familyMembers, setFamilyMembers] = useState([]);
    const [selectedFamilyMemberId, setSelectedFamilyMemberId] = useState('');
    const [opcoes, setOpcoes] = useState([])

    useEffect(() => {
        setOpcoes([...familyMembers.map(m => ({ value: m.value, label: m.label, type: 'family' })),
        { value: candidato.id, label: candidato.nome, type: 'candidate' }])

    }, [familyMembers])

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

    function formatCurrency(value) {
        const numericValue = Number(value);
        if (isNaN(numericValue)) return '';
        return numericValue.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    }
    return (
        <div className="fill-box">
            <form onSubmit={handleSubmit} id='survey-form'>
                <div className='survey-box'>
                    <label>Nome do Familiar:</label>
                    <Select
                        options={opcoes}
                        isDisabled={!isEditing} onChange={handleSelectChange}
                        value={opcoes.find(option => option.label === formData.familyMemberName)}
                        required
                    />
                </div>

                <div className='survey-box'>
                    <label>Valor da Parcela:</label>
                    <br />
                    <input
                        type="text"
                        name="installmentValue"
                        value={formData.installmentValue ? formatCurrency(formData.installmentValue) : ''}
                        onChange={handleChange}
                        className='survey-control'
                        required
                    />
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
                            <button className="over-button" type="button" onClick={toggleEdit}>Cancelar</button>
                        </>
                    )}
                </div>            </form>
        </div>
    );
}
