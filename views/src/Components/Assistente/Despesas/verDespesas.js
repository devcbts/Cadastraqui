import React, { useEffect, useState } from 'react';
import './cadastroDespesas.css';
import { api } from '../../../services/axios';

export default function VerDespesas({ formData }) {
    console.log('====================================');
    console.log(formData.otherExpensesDescription);
    console.log('====================================');
    const getCurrentDate = () => {
        const today = new Date();
        const month = `${today.getMonth() + 1}`.padStart(2, '0'); // Adiciona um zero à esquerda se necessário
        const year = today.getFullYear();
        return `${year}-${month}`;
    };
    /*const [formData, setFormData] = useState({
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

    */

    const handleOtherExpensesChange = (e, index, type) => {
        /*
        if (type === 'description') {
            const newDescriptions = [...formData.otherExpensesDescription];
            newDescriptions[index] = e.target.value;
            setFormData({ ...formData, otherExpensesDescription: newDescriptions });
        } else if (type === 'value') {
            const newValues = [...formData.otherExpensesValue];
            newValues[index] = Number(e.target.value);
            setFormData({ ...formData, otherExpensesValue: newValues });
        }*/
    };

    const addOtherExpense = () => {
        /*
        setFormData(prevFormData => ({
            ...prevFormData,
            otherExpensesDescription: [...prevFormData.otherExpensesDescription, ''],
            otherExpensesValue: [...prevFormData.otherExpensesValue, '']
        }));
        */
    };


    const handleChange = (e) => {
        /*
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    */
    };

    const renderOtherExpenses = () => {
        const elements = [];
        console.log('====================================');
        console.log(formData);
        console.log('====================================');
        if (formData && Array.isArray(formData.otherExpensesDescription)) {
            for (let index = 0; index < formData.otherExpensesDescription.length; index++) {
                elements.push(
                    <div key={index}>
                        <div className='survey-box'>
                            <label>Descrição da Despesa {index + 1}:</label>
                            <input
                                className='survey-control'
                                type="text"
                                value={formData.otherExpensesDescription[index]}
                                disabled
                            />
                        </div>
                        <div className='survey-box'>
                            <label>Valor da Despesa {index + 1}:</label>
                            <input
                                className='survey-control'
                                type="number"
                                value={formData.otherExpensesValue[index]}
                                disabled
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

        try {
            const response = await api.post("/candidates/expenses", {
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
            console.log(response.data);
            alert("Despesas cadastradas com sucesso");
        } catch (err) {
            alert(err.message);
        }
    };
    /*
        useEffect(() =>{
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
                ].reduce((acc, value) => acc + (parseFloat(value) || 0), 0);
            
                setFormData({ ...formData, totalExpense: total });
            };
            calculateTotalExpense();
        },[formData])
    */
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
                        disabled
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
                        type="number"
                        name="waterSewage"
                        value={formData.waterSewage}
                        disabled
                        onChange={handleChange}
                    />
                </div>

                {/* Repetir para os outros campos numéricos */}
                <div className='survey-box'>
                    <label>Eletricidade:</label>
                    <input
                        className='survey-control'
                        type="number"
                        name="electricity"
                        value={formData.electricity}
                        disabled
                        onChange={handleChange}
                    />
                </div>
                {/* Telefone fixo */}
                <div className='survey-box'>
                    <label>Telefone Fixo:</label>
                    <input
                        className='survey-control'
                        type="number"
                        name="landlinePhone"
                        value={formData.landlinePhone}
                        disabled
                        onChange={handleChange}
                    />
                </div>

                {/* Telefone móvel */}
                <div className='survey-box'>
                    <label>Telefone Celular:</label>
                    <input
                        className='survey-control'
                        type="number"
                        name="mobilePhone"
                        value={formData.mobilePhone}
                        disabled
                        onChange={handleChange}
                    />
                </div>

                {/* Alimentação */}
                <div className='survey-box'>
                    <label>Alimentação:</label>
                    <input
                        className='survey-control'
                        type="number"
                        name="food"
                        value={formData.food}
                        disabled
                        onChange={handleChange}
                    />
                </div>

                {/* Aluguel */}
                <div className='survey-box'>
                    <label>Aluguel:</label>
                    <input
                        className='survey-control'
                        type="number"
                        name="rent"
                        value={formData.rent}
                        disabled
                        onChange={handleChange}
                    />
                </div>

                {/* Aluguel de Garagem */}
                <div className='survey-box'>
                    <label>Aluguel de Garagem:</label>
                    <input
                        className='survey-control'
                        type="number"
                        name="garageRent"
                        value={formData.garageRent}
                        disabled
                        onChange={handleChange}
                    />
                </div>

                {/* Condomínio */}
                <div className='survey-box'>
                    <label>Condomínio:</label>
                    <input
                        className='survey-control'
                        type="number"
                        name="condominium"
                        value={formData.condominium}
                        disabled
                        onChange={handleChange}
                    />
                </div>

                {/* TV a Cabo */}
                <div className='survey-box'>
                    <label>TV a Cabo:</label>
                    <input
                        className='survey-control'
                        type="number"
                        name="cableTV"
                        value={formData.cableTV}
                        disabled
                        onChange={handleChange}
                    />
                </div>

                {/* Serviços de Streaming */}
                <div className='survey-box'>
                    <label>Serviços de Streaming:</label>
                    <input
                        className='survey-control'
                        type="number"
                        name="streamingServices"
                        value={formData.streamingServices}
                        disabled
                        onChange={handleChange}
                    />
                </div>

                {/* Combustível */}
                <div className='survey-box'>
                    <label>Combustível:</label>
                    <input
                        className='survey-control'
                        type="number"
                        name="fuel"
                        value={formData.fuel}
                        disabled
                        onChange={handleChange}
                    />
                </div>

                {/* IPVA Anual */}
                <div className='survey-box'>
                    <label>IPVA Anual:</label>
                    <input
                        className='survey-control'
                        type="number"
                        name="annualIPVA"
                        value={formData.annualIPVA}
                        disabled
                        onChange={handleChange}
                    />
                </div>
                <div className='survey-box'>
                    <label>Possui parcelamento de IPVA?</label>
                    <input
                        className='survey-control'
                        type="checkbox"
                        name="optedForInstallmentIPVA"
                        checked={formData.optedForInstallmentIPVA}
                        disabled
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
                                value={formData.installmentCountIPVA}
                                disabled
                                onChange={handleChange}
                            />
                        </div>
                        <div className='survey-box'>
                            <label>Valor da Parcela de IPVA:</label>
                            <input
                                className='survey-control'
                                type="number"
                                name="installmentValueIPVA"
                                value={formData.installmentValueIPVA}
                                disabled
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
                        type="number"
                        name="annualIPTU"
                        value={formData.annualIPTU}
                        disabled
                        onChange={handleChange}
                    />
                </div>

                {/* Parcelamento do IPTU */}
                <div className='survey-box'>
                    <label>Possui parcelamento de IPTU?</label>
                    <input
                        className='survey-control'
                        type="checkbox"
                        name="optedForInstallmentIPTU"
                        checked={formData.optedForInstallmentIPTU}
                        disabled
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
                                value={formData.installmentCountIPTU}
                                disabled
                                onChange={handleChange}
                            />
                        </div>
                        <div className='survey-box'>
                            <label>Valor da Parcela de IPTU:</label>
                            <input
                                className='survey-control'
                                type="number"
                                name="installmentValueIPTU"
                                value={formData.installmentValueIPTU}
                                disabled
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
                        type="number"
                        name="annualITR"
                        value={formData.annualITR}
                        disabled
                        onChange={handleChange}
                    />
                </div>

                {/* Parcelamento do ITR */}
                <div className='survey-box'>
                    <label>Possui parcelamento de ITR?</label>
                    <input
                        className='survey-control'
                        type="checkbox"
                        name="optedForInstallmentITR"
                        checked={formData.optedForInstallmentITR}
                        disabled
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
                                value={formData.installmentCountITR}
                                disabled
                                onChange={handleChange}
                            />
                        </div>
                        <div className='survey-box'>
                            <label>Valor da Parcela de ITR:</label>
                            <input
                                className='survey-control'
                                type="number"
                                name="installmentValueITR"
                                value={formData.installmentValueITR}
                                disabled
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
                        type="number"
                        name="annualIR"
                        value={formData.annualIR}
                        disabled
                        onChange={handleChange}
                    />
                </div>
                {/* Parcelamento do IR */}
                <div className='survey-box'>
                    <label>Possui parcelamento de IR?</label>
                    <input
                        className='survey-control'
                        type="checkbox"
                        name="optedForInstallmentIR"
                        checked={formData.optedForInstallmentIR}
                        disabled
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
                                value={formData.installmentCountIR}
                                disabled
                                onChange={handleChange}
                            />
                        </div>
                        <div className='survey-box'>
                            <label>Valor da Parcela de IR:</label>
                            <input
                                className='survey-control'
                                type="number"
                                name="installmentValueIR"
                                value={formData.installmentValueIR}
                                disabled
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
                        type="number"
                        name="INSS"
                        value={formData.INSS}
                        disabled
                        onChange={handleChange}
                    />
                </div>

                {/* Transporte Público */}
                <div className='survey-box'>
                    <label>Transporte Público:</label>
                    <input
                        className='survey-control'
                        type="number"
                        name="publicTransport"
                        value={formData.publicTransport}
                        disabled
                        onChange={handleChange}
                    />
                </div>

                {/* Transporte Escolar */}
                <div className='survey-box'>
                    <label>Transporte Escolar:</label>
                    <input
                        className='survey-control'
                        type="number"
                        name="schoolTransport"
                        value={formData.schoolTransport}
                        disabled
                        onChange={handleChange}
                    />
                </div>

                {/* Internet */}
                <div className='survey-box'>
                    <label>Internet:</label>
                    <input
                        className='survey-control'
                        type="number"
                        name="internet"
                        value={formData.internet}
                        disabled
                        onChange={handleChange}
                    />
                </div>

                {/* Cursos */}
                <div className='survey-box'>
                    <label>Cursos:</label>
                    <input
                        className='survey-control'
                        type="number"
                        name="courses"
                        value={formData.courses}
                        disabled
                        onChange={handleChange}
                    />
                </div>

                {/* Plano de Saúde */}
                <div className='survey-box'>
                    <label>Plano de Saúde:</label>
                    <input
                        className='survey-control'
                        type="number"
                        name="healthPlan"
                        value={formData.healthPlan}
                        disabled
                        onChange={handleChange}
                    />
                </div>

                {/* Plano Dental */}
                <div className='survey-box'>
                    <label>Plano Dental:</label>
                    <input
                        className='survey-control'
                        type="number"
                        name="dentalPlan"
                        value={formData.dentalPlan}
                        disabled
                        onChange={handleChange}
                    />
                </div>

                {/* Despesas com Medicamentos */}
                <div className='survey-box'>
                    <label>Despesas com Medicamentos:</label>
                    <input
                        className='survey-control'
                        type="number"
                        name="medicationExpenses"
                        value={formData.medicationExpenses}
                        disabled
                        onChange={handleChange}
                    />
                </div>

                {/* Outras Despesas */}
                {/* Botão para adicionar outras despesas */}
                <button type="button" onClick={addOtherExpense}>Adicionar Outra Despesa</button>

                {/* Campos para outras despesas */}
                {renderOtherExpenses()}
                {/* Despesa Total */}
                <div className='survey-box'>
                    <label>Despesa Total:</label>
                    <input
                        className='survey-control'
                        type="number"
                        name="totalExpense"
                        value={formData.totalExpense}
                        disabled
                    />
                </div>

            </form>
        </div>
    );
}
