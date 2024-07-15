import React, { useEffect, useState } from 'react';
import { api } from '../../services/axios';
import './cadastroDespesas.css';
import { handleSuccess } from '../../ErrorHandling/handleSuceess';
import { handleAuthError } from '../../ErrorHandling/handleError';
import { formatCurrency } from '../../utils/format-currency';
import InputCheckbox from '../Inputs/InputCheckbox';
import { toFloat } from '../../utils/currency-to-float';

export default function CadastroDespesas() {
    const getCurrentDate = () => {
        const today = new Date();
        const month = `${today.getMonth() + 1}`.padStart(2, '0'); // Adiciona um zero à esquerda se necessário
        const year = today.getFullYear();
        return `${year}-${month}`;
    };

    // Antes de renderizar os inputs numéricos, formata o valor para exibição.
    function getFormattedValue(name) {
        const value = formData[name];
        if (!value) return ''; // Se não houver valor, retorna string vazia para evitar a exibição de "0"

        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    }
    const [formData, setFormData] = useState({
        month: '',
        waterSewage: '',
        electricity: '',
        landlinePhone: '',
        mobilePhone: '',
        food: '',
        rent: '',
        garageRent: '',
        condominium: '',
        cableTV: '',
        streamingServices: '',
        fuel: '',
        annualIPVA: '',
        optedForInstallmentIPVA: false,
        installmentCountIPVA: '',
        installmentValueIPVA: '',
        optedForInstallmentIPTU: false,
        installmentCountIPTU: '',
        installmentValueIPTU: '',
        optedForInstallmentITR: false,
        installmentCountITR: '',
        installmentValueITR: '',
        optedForInstallmentIR: false,
        installmentCountIR: '',
        installmentValueIR: '',
        otherExpensesDescription: [],
        otherExpensesValue: [],
        annualIPTU: '',
        annualITR: '',
        annualIR: '',
        INSS: '',
        publicTransport: '',
        schoolTransport: '',
        internet: '',
        courses: '',
        healthPlan: '',
        dentalPlan: '',
        medicationExpenses: '',
        totalExpense: '',
    });



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
            //const numericValue = toFloat(value);
            setFormData({ ...formData, [name]: value });
        } else if (['optedForInstallmentIPVA', 'optedForInstallmentIPTU', 'optedForInstallmentITR', 'optedForInstallmentIR'].includes(name)) {
            // Para checkboxes, trata o valor booleano
            setFormData({ ...formData, [name]: e.target.value });
        } else {
            // Para todos os outros campos, atualiza o estado diretamente
            setFormData({ ...formData, [name]: value });
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        calculateTotalExpense()
        try {
            const response = await api.post("/candidates/expenses", {
                month: formData.month,
                waterSewage: toFloat(formData.waterSewage) || undefined,
                electricity: toFloat(formData.electricity) || undefined,
                landlinePhone: toFloat(formData.landlinePhone) || undefined,
                mobilePhone: toFloat(formData.mobilePhone) || undefined,
                food: toFloat(formData.food) || undefined,
                rent: toFloat(formData.rent) || undefined,
                garageRent: toFloat(formData.garageRent) || undefined,
                condominium: toFloat(formData.condominium) || undefined,
                cableTV: toFloat(formData.cableTV) || undefined,
                streamingServices: toFloat(formData.streamingServices) || undefined,
                fuel: toFloat(formData.fuel) || undefined,
                annualIPVA: toFloat(formData.annualIPVA) || undefined,
                optedForInstallmentIPVA: formData.optedForInstallmentIPVA,
                installmentCountIPVA: toFloat(formData.installmentCountIPVA) || undefined,
                installmentValueIPVA: toFloat(formData.installmentValueIPVA) || undefined,
                optedForInstallmentIPTU: formData.optedForInstallmentIPTU,
                installmentCountIPTU: toFloat(formData.installmentCountIPTU),
                installmentValueIPTU: toFloat(formData.installmentValueIPTU) || undefined,
                optedForInstallmentITR: formData.optedForInstallmentITR,
                installmentCountITR: toFloat(formData.installmentCountITR) || undefined,
                installmentValueITR: toFloat(formData.installmentValueITR) || undefined,
                optedForInstallmentIR: formData.optedForInstallmentIR,
                installmentCountIR: toFloat(formData.installmentCountIR) || undefined,
                installmentValueIR: toFloat(formData.installmentValueIR) || undefined,
                otherExpensesDescription: formData.otherExpensesDescription || undefined,
                otherExpensesValue: formData.otherExpensesValue || undefined,
                annualIPTU: toFloat(formData.annualIPTU) || undefined,
                annualITR: toFloat(formData.annualIPVA) || undefined,
                annualIR: toFloat(formData.annualIR) || undefined,
                INSS: toFloat(formData.INSS) || undefined,
                publicTransport: toFloat(formData.publicTransport) || undefined,
                schoolTransport: toFloat(formData.schoolTransport) || undefined,
                internet: toFloat(formData.internet) || undefined,
                courses: toFloat(formData.courses) || undefined,
                healthPlan: toFloat(formData.healthPlan) || undefined,
                dentalPlan: toFloat(formData.dentalPlan) || undefined,
                medicationExpenses: toFloat(formData.medicationExpenses) || undefined,
                totalExpense: toFloat(formData.totalExpense) || undefined,
            }, {
                headers: {
                    'authorization': `Bearer ${token}`,
                }
            });
            ;
            handleSuccess(response, "Despesas cadastradas com sucesso");
        } catch (err) {
            handleAuthError(err)
        }
    };


    const calculateTotalExpense = () => {
        const total = [
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
            formData.medicationExpenses,
            ...formData.otherExpensesValue
        ].reduce((acc, value) => acc + (toFloat(value) || 0), 0);

        setFormData({
            ...formData, totalExpense: total.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            })
        });
    };

    function getFormattedValue(name) {
        const value = formData[name];
        if (value || value === 0) {
            return value.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            });
        }
        return '';
    }

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
                        onChange={handleChange}
                    />
                </div>
                <div className='survey-box'>
                    <label>Possui parcelamento de IPVA?</label>
                    <InputCheckbox
                        className='survey-control'
                        type="checkbox"
                        name="optedForInstallmentIPVA"
                        value={formData.optedForInstallmentIPVA}
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
                        onChange={handleChange}
                    />
                </div>

                {/* Parcelamento do IPTU */}
                <div className='survey-box'>
                    <label>Possui parcelamento de IPTU?</label>
                    <InputCheckbox
                        className='survey-control'
                        type="checkbox"
                        name="optedForInstallmentIPTU"
                        value={formData.optedForInstallmentIPTU}
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
                        onChange={handleChange}
                    />
                </div>

                {/* Parcelamento do ITR */}
                <div className='survey-box'>
                    <label>Possui parcelamento de ITR?</label>
                    <InputCheckbox
                        className='survey-control'
                        type="checkbox"
                        name="optedForInstallmentITR"
                        value={formData.optedForInstallmentITR}
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
                        onChange={handleChange}
                    />
                </div>
                {/* Parcelamento do IR */}
                <div className='survey-box'>
                    <label>Possui parcelamento de IR?</label>
                    <InputCheckbox
                        className='survey-control'
                        type="checkbox"
                        name="optedForInstallmentIR"
                        value={formData.optedForInstallmentIR}
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
                        onChange={handleChange}
                    />
                </div>

                {/* Outras Despesas */}
                {/* Botão para adicionar outras despesas */}
                <button type="button" onClick={addOtherExpense}>Adicionar Outra Despesa</button>

                {/* Campos para outras despesas */}
                {formData.otherExpensesDescription.map((_, index) => (
                    <div key={index}>
                        <div className='survey-box'>
                            <label>Descrição da Despesa {index + 1}:</label>
                            <input
                                className='survey-control'
                                type="number"
                                value={formData.otherExpensesDescription[index]}
                                onChange={(e) => handleOtherExpensesChange(e, index, 'description')}
                            />
                        </div>
                        <div className='survey-box'>
                            <label>Valor da Despesa {index + 1}:</label>
                            <input
                                className='survey-control'
                                type="text"
                                value={formData.otherExpensesValue[index]}
                                onChange={(e) => handleOtherExpensesChange(e, index, 'value')}
                            />
                        </div>
                    </div>
                ))}
                <button type='button' onClick={calculateTotalExpense}>Calcular Despesa total:</button>
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

                <button type="submit">Cadastrar Despesas</button>
            </form>
        </div>
    );
}
