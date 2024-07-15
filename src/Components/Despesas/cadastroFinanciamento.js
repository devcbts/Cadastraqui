import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './cadastroDespesas.css'; // Adicione um arquivo CSS para estilizar o formulário
import { api } from '../../services/axios';
import Select from 'react-select';
import { handleSuccess } from '../../ErrorHandling/handleSuceess';
import { formatCurrency } from '../../utils/format-currency';

export default function CadastroFinanciamento({ candidate }) {
    const [formData, setFormData] = useState({
        familyMemberName: '',
        financingType: 'House_Apartment_Land', // Valor padrão
        otherFinancing: '',
        installmentValue: '',
        totalInstallments: '',
        paidInstallments: '',
        bankName: '',
    });

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
            ;
            handleSuccess(response, "Dados cadastrados com sucesso!")

            // Trate a resposta conforme necessário
        } catch (error) {
            console.error(error.response?.data || error.message);
            // Trate o erro conforme necessário
        }
    };

    const [familyMembers, setFamilyMembers] = useState([]);
    const [selectedFamilyMemberId, setSelectedFamilyMemberId] = useState('');
    const [candidato, setCandidato] = useState({ id: candidate.id, nome: candidate.name });
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
        setFormData({ ...formData, familyMemberName: selectedOption.label });
        setSelectedFamilyMemberId(selectedOption.value);
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
                        onChange={e => setFormData({ ...formData, financingType: e.value })}
                        value={financingTypes.find(option => option.value === formData.financingType)}
                        required
                    />
                </div>

                {formData.financingType === 'Other' && (
                    <div className='survey-box'>
                        <label>Outro Tipo de Financiamento:</label>
                        <input type="text" name="otherFinancing" value={formData.otherFinancing} onChange={handleChange} className='survey-control' />
                    </div>
                )}

                <div className='survey-box'>
                    <label>Nome do Familiar:</label>
                    <Select
                        options={opcoes}
                        onChange={handleSelectChange}
                        value={opcoes.find(option => option.value === selectedFamilyMemberId)}
                        required
                    />
                </div>

                <div className='survey-box'>
                    <label>Valor da Parcela:</label>
                    <input type="text" name="installmentValue" value={formatCurrency(formData.installmentValue)} onChange={handleChange} className='survey-control' required />
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

                <button type="submit" className="button">Enviar</button>            </form>
        </div>
    );
}
