import React, { useEffect, useState } from 'react';
import { api } from '../../services/axios';
import './cadastroDespesas.css';
import { handleAuthError } from '../../ErrorHandling/handleError';
import { handleSuccess } from '../../ErrorHandling/handleSuceess';
import { formatCurrency } from '../../utils/format-currency';
import InputCheckbox from '../Inputs/InputCheckbox';

export default function VerDespesas({ formDataInfo }) {

    const getCurrentDate = () => {
        const today = new Date();
        const month = `${today.getMonth() + 1}`.padStart(2, '0'); // Adiciona um zero à esquerda se necessário
        const year = today.getFullYear();
        return `${year}-${month}`;
    };
    const [formData, setFormData] = useState(
        formDataInfo
    );

    //Edição de dados
    const [isEditing, setIsEditing] = useState(false)

    function toggleEdit() {
        setIsEditing(!isEditing); // Alterna o estado de edição
    }

    useEffect(() => {
        setFormData(formDataInfo);
        setIsEditing(false);
    }, [formDataInfo])



    const handleOtherExpensesChange = (e, index, type) => {

        if (type === 'description') {
            const newDescriptions = [...formData.otherExpensesDescription];
            newDescriptions[index] = e.target.value;
            setFormData({ ...formData, otherExpensesDescription: newDescriptions });
        } else if (type === 'value') {
            const newValues = [...formData.otherExpensesValue];
            newValues[index] = Number(e.target.value);
            setFormData({ ...formData, otherExpensesValue: newValues });
        }
    };

    const addOtherExpense = () => {

        setFormData(prevFormData => ({
            ...prevFormData,
            otherExpensesDescription: [...prevFormData.otherExpensesDescription, ''],
            otherExpensesValue: [...prevFormData.otherExpensesValue, '']
        }));

    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (['waterSewage', 'electricity', 'landlinePhone', 'mobilePhone', 'food', 'rent', 'garageRent', 'condominium', 'cableTV', 'streamingServices',
            'fuel', 'annualIPVA', 'annualIPTU', 'annualITR', 'annualIR', 'INSS', 'publicTransport', 'schoolTransport', 'internet', 'courses', 'healthPlan',
            'dentalPlan', 'medicationExpenses', 'otherExpensesValue', "installmentValueIPVA", "installmentValueIPTU", "installmentValueIR", "installmentValueITR"].includes(name)) {
            // Para campos monetários, formata o valor antes de atualizar o estado
            const numericValue = parseFloat(value.replace(/\D/g, '').replace(/(\d)(\d{2})$/, '$1.$2')) || '';
            setFormData({ ...formData, [name]: numericValue });
        } else if (['optedForInstallmentIPVA', 'optedForInstallmentIPTU', 'optedForInstallmentITR', 'optedForInstallmentIR'].includes(name)) {
            // Para checkboxes, trata o valor booleano
            setFormData({ ...formData, [name]: e.target.value });
        } else {
            // Para todos os outros campos, atualiza o estado diretamente
            setFormData({ ...formData, [name]: value });
        }
    };
    const renderOtherExpenses = () => {
        const elements = [];
        ;
        ;
        ;
        if (formData && Array.isArray(formData.otherExpensesDescription)) {
            for (let index = 0; index < formData.otherExpensesDescription.length; index++) {
                elements.push(
                    <div key={index}>
                        <div className='survey-box'>
                            <label>Descrição da Despesa {index + 1}:</label>
                            <input
                                className='survey-control'
                                type="text"
                                onChange={(e) => handleOtherExpensesChange(e, index, 'description')}
                                value={formData.otherExpensesDescription[index]}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className='survey-box'>
                            <label>Valor da Despesa {index + 1}:</label>
                            <input
                                className='survey-control'
                                type="text"
                                disabled={!isEditing}
                                value={formatCurrency(formData.otherExpensesValue)[index]}
                                onChange={(e) => handleOtherExpensesChange(e, index, 'value')}
                            />
                        </div>
                    </div>
                );
            }
        }

        return elements;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        calculateTotalExpense()
        try {
            const response = await api.patch("/candidates/expenses", {
                id: formData.id,
                month: formData.month,
                waterSewage: Number(formData.waterSewage) || undefined,
                electricity: Number(formData.electricity) || undefined,
                landlinePhone: Number(formData.landlinePhone) || undefined,
                mobilePhone: Number(formData.mobilePhone) || undefined,
                food: Number(formData.food) || undefined,
                rent: Number(formData.rent) || undefined,
                garageRent: Number(formData.garageRent) || undefined,
                condominium: Number(formData.condominium) || undefined,
                cableTV: Number(formData.cableTV) || undefined,
                streamingServices: Number(formData.streamingServices) || undefined,
                fuel: Number(formData.fuel) || undefined,
                annualIPVA: Number(formData.annualIPVA) || undefined,
                optedForInstallmentIPVA: formData.optedForInstallmentIPVA,
                installmentCountIPVA: Number(formData.installmentCountIPVA) || undefined,
                installmentValueIPVA: Number(formData.installmentValueIPVA) || undefined,
                optedForInstallmentIPTU: formData.optedForInstallmentIPTU,
                installmentCountIPTU: Number(formData.installmentCountIPTU),
                installmentValueIPTU: Number(formData.installmentValueIPTU) || undefined,
                optedForInstallmentITR: formData.optedForInstallmentITR,
                installmentCountITR: Number(formData.installmentCountITR) || undefined,
                installmentValueITR: Number(formData.installmentValueITR) || undefined,
                optedForInstallmentIR: formData.optedForInstallmentIR,
                installmentCountIR: Number(formData.installmentCountIR) || undefined,
                installmentValueIR: Number(formData.installmentValueIR) || undefined,
                otherExpensesDescription: formData.otherExpensesDescription || undefined,
                otherExpensesValue: formData.otherExpensesValue || undefined,
                annualIPTU: Number(formData.annualIPTU) || undefined,
                annualITR: Number(formData.annualIPVA) || undefined,
                annualIR: Number(formData.annualIR) || undefined,
                INSS: Number(formData.INSS) || undefined,
                publicTransport: Number(formData.publicTransport) || undefined,
                schoolTransport: Number(formData.schoolTransport) || undefined,
                internet: Number(formData.internet) || undefined,
                courses: Number(formData.courses) || undefined,
                healthPlan: Number(formData.healthPlan) || undefined,
                dentalPlan: Number(formData.dentalPlan) || undefined,
                medicationExpenses: Number(formData.medicationExpenses) || undefined,
                totalExpense: Number(formData.totalExpense) || undefined,
            }, {
                headers: {
                    'authorization': `Bearer ${token}`,
                }
            });
            ;
            handleSuccess(response, 'Dados Atualizados com sucesso!')
        } catch (err) {
            handleAuthError(err)

        }
    };
    const calculateTotalExpense = () => {
        const expenses = [
            formData.waterSewage,
            formData.electricity,
            formData.landlinePhone,
            formData.mobilePhone,
            formData.food,
            formData.rent,
            formData.garageRent,
            formData.condominium,
            formData.cableTV,
            formData.streamingServices,
            formData.fuel,
            formData.annualIPVA,
            formData.annualIPTU,
            formData.annualITR,
            formData.annualIR,
            formData.INSS,
            formData.publicTransport,
            formData.schoolTransport,
            formData.internet,
            formData.courses,
            formData.healthPlan,
            formData.dentalPlan,
            formData.medicationExpenses
        ];

        // Verifica se formData.otherExpensesValue é um array e tem elementos antes de adicionar ao array de despesas
        if (Array.isArray(formData.otherExpensesValue) && formData.otherExpensesValue.length > 0) {
            expenses.push(...formData.otherExpensesValue);
        }

        const total = expenses.reduce((acc, value) => acc + (parseFloat(value) || 0), 0);
        setFormData({ ...formData, totalExpense: total });
    };

    useEffect(() => {


        calculateTotalExpense();
    }, [formDataInfo])

    return (
        <div className='fill-box'>
            <form onSubmit={handleSubmit} id='survey-form'>
                {/* Campos do formulário */}
                {/* Exemplo para um campo: */}
                <div className='survey-box'>
                    <label>Mês:</label>
                    <input
                        className='survey-control'
                        type="date"
                        name="month"
                        value={formData.month}
                        disabled={!isEditing}
                        onChange={handleChange}
                        required
                    />
                </div>
                {/* Repetir para os outros campos de formData */}


                {/* Exemplo para campos numéricos opcionais */}
                <div className='survey-box'>
                    <label>Água e Esgoto:</label>
                    <input
                        className='survey-control'
                        type="text"
                        name="waterSewage"
                        value={formatCurrency(formData.waterSewage)}
                        disabled={!isEditing}
                        onChange={handleChange}
                    />
                </div>

                {/* Repetir para os outros campos numéricos */}
                <div className='survey-box'>
                    <label>Eletricidade:</label>
                    <input
                        className='survey-control'
                        type="text"
                        name="electricity"
                        value={formatCurrency(formData.electricity)}
                        disabled={!isEditing}
                        onChange={handleChange}
                    />
                </div>
                {/* Telefone fixo */}
                <div className='survey-box'>
                    <label>Telefone Fixo:</label>
                    <input
                        className='survey-control'
                        type="text"
                        name="landlinePhone"
                        value={formatCurrency(formData.landlinePhone)}
                        disabled={!isEditing}
                        onChange={handleChange}
                    />
                </div>

                {/* Telefone móvel */}
                <div className='survey-box'>
                    <label>Telefone Celular:</label>
                    <input
                        className='survey-control'
                        type="text"
                        name="mobilePhone"
                        value={formatCurrency(formData.mobilePhone)}
                        disabled={!isEditing}
                        onChange={handleChange}
                    />
                </div>

                {/* Alimentação */}
                <div className='survey-box'>
                    <label>Alimentação:</label>
                    <input
                        className='survey-control'
                        type="text"
                        name="food"
                        value={formatCurrency(formData.food)}
                        disabled={!isEditing}
                        onChange={handleChange}
                    />
                </div>

                {/* Aluguel */}
                <div className='survey-box'>
                    <label>Aluguel:</label>
                    <input
                        className='survey-control'
                        type="text"
                        name="rent"
                        value={formatCurrency(formData.rent)}
                        disabled={!isEditing}
                        onChange={handleChange}
                    />
                </div>

                {/* Aluguel de Garagem */}
                <div className='survey-box'>
                    <label>Aluguel de Garagem:</label>
                    <input
                        className='survey-control'
                        type="text"
                        name="garageRent"
                        value={formatCurrency(formData.garageRent)}
                        disabled={!isEditing}
                        onChange={handleChange}
                    />
                </div>

                {/* Condomínio */}
                <div className='survey-box'>
                    <label>Condomínio:</label>
                    <input
                        className='survey-control'
                        type="text"
                        name="condominium"
                        value={formatCurrency(formData.condominium)}
                        disabled={!isEditing}
                        onChange={handleChange}
                    />
                </div>

                {/* TV a Cabo */}
                <div className='survey-box'>
                    <label>TV a Cabo:</label>
                    <input
                        className='survey-control'
                        type="text"
                        name="cableTV"
                        value={formatCurrency(formData.cableTV)}
                        disabled={!isEditing}
                        onChange={handleChange}
                    />
                </div>

                {/* Serviços de Streaming */}
                <div className='survey-box'>
                    <label>Serviços de Streaming:</label>
                    <input
                        className='survey-control'
                        type="text"
                        name="streamingServices"
                        value={formatCurrency(formData.streamingServices)}
                        disabled={!isEditing}
                        onChange={handleChange}
                    />
                </div>

                {/* Combustível */}
                <div className='survey-box'>
                    <label>Combustível:</label>
                    <input
                        className='survey-control'
                        type="text"
                        name="fuel"
                        value={formatCurrency(formData.fuel)}
                        disabled={!isEditing}
                        onChange={handleChange}
                    />
                </div>

                {/* IPVA Anual */}
                <div className='survey-box'>
                    <label>IPVA Anual:</label>
                    <input
                        className='survey-control'
                        type="text"
                        name="annualIPVA"
                        value={formatCurrency(formData.annualIPVA)}
                        disabled={!isEditing}
                        onChange={handleChange}
                    />
                </div>
                <div className='survey-box survey-check'>
                    <label>Possui parcelamento de IPVA?</label>
                    <InputCheckbox
                        className='survey-control'
                        type="checkbox"
                        name="optedForInstallmentIPVA"
                        value={formData.optedForInstallmentIPVA}
                        disabled={!isEditing}
                        onChange={handleChange}
                    />
                </div>
                {formData.optedForInstallmentIPVA && (
                    <>
                        <div className='survey-box'>
                            <label>Número de Parcelas de IPVA:</label>
                            <input
                                className='survey-control'
                                type="number"
                                name="installmentCountIPVA"
                                value={(formData.installmentCountIPVA)}
                                disabled={!isEditing}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='survey-box'>
                            <label>Valor da Parcela de IPVA:</label>
                            <input
                                className='survey-control'
                                type="text"
                                name="installmentValueIPVA"
                                value={formatCurrency(formData.installmentValueIPVA)}
                                disabled={!isEditing}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                )}
                {/* IPTU Anual */}
                <div className='survey-box'>
                    <label>IPTU Anual:</label>
                    <input
                        className='survey-control'
                        type="text"
                        name="annualIPTU"
                        value={formatCurrency(formData.annualIPTU)}
                        disabled={!isEditing}
                        onChange={handleChange}
                    />
                </div>

                {/* Parcelamento do IPTU */}
                <div className='survey-box survey-check'>
                    <label>Possui parcelamento de IPTU?</label>
                    <InputCheckbox
                        className='survey-control'
                        type="checkbox"
                        name="optedForInstallmentIPTU"
                        value={formData.optedForInstallmentIPTU}
                        disabled={!isEditing}
                        onChange={handleChange}
                    />
                </div>
                {formData.optedForInstallmentIPTU && (
                    <>
                        <div className='survey-box'>
                            <label>Número de Parcelas de IPTU:</label>
                            <input
                                className='survey-control'
                                type="number"
                                name="installmentCountIPTU"
                                value={(formData.installmentCountIPTU)}
                                disabled={!isEditing}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='survey-box'>
                            <label>Valor da Parcela de IPTU:</label>
                            <input
                                className='survey-control'
                                type="text"
                                name="installmentValueIPTU"
                                value={formatCurrency(formData.installmentValueIPTU)}
                                disabled={!isEditing}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                )}


                {/* ITR Anual */}
                <div className='survey-box'>
                    <label>ITR Anual:</label>
                    <input
                        className='survey-control'
                        type="text"
                        name="annualITR"
                        value={formatCurrency(formData.annualITR)}
                        disabled={!isEditing}
                        onChange={handleChange}
                    />
                </div>

                {/* Parcelamento do ITR */}
                <div className='survey-box survey-check'>
                    <label>Possui parcelamento de ITR?</label>
                    <InputCheckbox
                        className='survey-control'
                        type="checkbox"
                        name="optedForInstallmentITR"
                        value={formData.optedForInstallmentITR}
                        disabled={!isEditing}
                        onChange={handleChange}
                    />
                </div>
                {formData.optedForInstallmentITR && (
                    <>
                        <div className='survey-box'>
                            <label>Número de Parcelas de ITR:</label>
                            <input
                                className='survey-control'
                                type="number"
                                name="installmentCountITR"
                                value={(formData.installmentCountITR)}
                                disabled={!isEditing}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='survey-box'>
                            <label>Valor da Parcela de ITR:</label>
                            <input
                                className='survey-control'
                                type="text"
                                name="installmentValueITR"
                                value={formatCurrency(formData.installmentValueITR)}
                                disabled={!isEditing}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                )}

                {/* IR Anual */}
                <div className='survey-box'>
                    <label>IR Anual:</label>
                    <input
                        className='survey-control'
                        type="text"
                        name="annualIR"
                        value={formatCurrency(formData.annualIR)}
                        disabled={!isEditing}
                        onChange={handleChange}
                    />
                </div>
                {/* Parcelamento do IR */}
                <div className='survey-box survey-check'>
                    <label>Possui parcelamento de IR?</label>
                    <InputCheckbox
                        className='survey-control'
                        type="checkbox"
                        name="optedForInstallmentIR"
                        value={formData.optedForInstallmentIR}
                        disabled={!isEditing}
                        onChange={handleChange}
                    />
                </div>
                {formData.optedForInstallmentIR && (
                    <>
                        <div className='survey-box'>
                            <label>Número de Parcelas de IR:</label>
                            <input
                                className='survey-control'
                                type="number"
                                name="installmentCountIR"
                                value={(formData.installmentCountIR)}
                                disabled={!isEditing}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='survey-box'>
                            <label>Valor da Parcela de IR:</label>
                            <input
                                className='survey-control'
                                type="text"
                                name="installmentValueIR"
                                value={formatCurrency(formData.installmentValueIR)}
                                disabled={!isEditing}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                )}

                {/* INSS */}
                <div className='survey-box'>
                    <label>INSS:</label>
                    <input
                        className='survey-control'
                        type="text"
                        name="INSS"
                        value={formatCurrency(formData.INSS)}
                        disabled={!isEditing}
                        onChange={handleChange}
                    />
                </div>

                {/* Transporte Público */}
                <div className='survey-box'>
                    <label>Transporte Público:</label>
                    <input
                        className='survey-control'
                        type="text"
                        name="publicTransport"
                        value={formatCurrency(formData.publicTransport)}
                        disabled={!isEditing}
                        onChange={handleChange}
                    />
                </div>

                {/* Transporte Escolar */}
                <div className='survey-box'>
                    <label>Transporte Escolar:</label>
                    <input
                        className='survey-control'
                        type="text"
                        name="schoolTransport"
                        value={formatCurrency(formData.schoolTransport)}
                        disabled={!isEditing}
                        onChange={handleChange}
                    />
                </div>

                {/* Internet */}
                <div className='survey-box'>
                    <label>Internet:</label>
                    <input
                        className='survey-control'
                        type="text"
                        name="internet"
                        value={formatCurrency(formData.internet)}
                        disabled={!isEditing}
                        onChange={handleChange}
                    />
                </div>

                {/* Cursos */}
                <div className='survey-box'>
                    <label>Cursos:</label>
                    <input
                        className='survey-control'
                        type="text"
                        name="courses"
                        value={formatCurrency(formData.courses)}
                        disabled={!isEditing}
                        onChange={handleChange}
                    />
                </div>

                {/* Plano de Saúde */}
                <div className='survey-box'>
                    <label>Plano de Saúde:</label>
                    <input
                        className='survey-control'
                        type="text"
                        name="healthPlan"
                        value={formatCurrency(formData.healthPlan)}
                        disabled={!isEditing}
                        onChange={handleChange}
                    />
                </div>

                {/* Plano Dental */}
                <div className='survey-box'>
                    <label>Plano Dental:</label>
                    <input
                        className='survey-control'
                        type="text"
                        name="dentalPlan"
                        value={formatCurrency(formData.dentalPlan)}
                        disabled={!isEditing}
                        onChange={handleChange}
                    />
                </div>

                {/* Despesas com Medicamentos */}
                <div className='survey-box'>
                    <label>Despesas com Medicamentos:</label>
                    <input
                        className='survey-control'
                        type="text"
                        name="medicationExpenses"
                        value={formatCurrency(formData.medicationExpenses)}
                        disabled={!isEditing}
                        onChange={handleChange}
                    />
                </div>

                {/* Outras Despesas */}
                {/* Botão para adicionar outras despesas */}
                <button type="button" onClick={addOtherExpense}>Adicionar Outra Despesa</button>

                {/* Campos para outras despesas */}
                {renderOtherExpenses()}
                {/* Despesa Total */}
                <button style={{ display: isEditing ? 'block' : 'none' }} onClick={calculateTotalExpense}>Calcular Despesa total:</button>
                {/* Despesa Total */}
                <div className='survey-box'>
                    <label>Despesa Total:</label>
                    <input
                        className='survey-control'
                        type="text"
                        name="totalExpense"
                        value={formatCurrency(formData.totalExpense)}
                        disabled
                    />
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
                </div>
            </form>
        </div>
    );
}
