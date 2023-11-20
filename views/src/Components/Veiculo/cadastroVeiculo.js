import React, { useState, useEffect } from 'react';
import './cadastroVeiculo.css'
import Select from 'react-select'
import { api } from '../../services/axios';
const VehicleType = [
    { value: 'SmallCarsAndUtilities', label: 'Carros Pequenos e Utilitários' },
    { value: 'TrucksAndMinibuses', label: 'Caminhões e Vans' },
    { value: 'Motorcycles', label: 'Motocicletas' },
];

const VehicleSituation = [
    { value: 'PaidOff', label: 'Quitado' },
    { value: 'Financed', label: 'Financiado' },
];

const VehicleUsage = [
    { value: 'WorkInstrument', label: 'Instrumento de Trabalho' },
    { value: 'NecessaryDisplacement', label: 'Deslocamento Necessário' },
];
// Componente de formulário para registrar informações do veículo
export default function CadastroVeiculo() {
    const [formData, setFormData] = useState({
        vehicleType: 'SmallCarsAndUtilities',
        modelAndBrand: '',
        manufacturingYear: '',
        situation: 'PaidOff',
        financedMonths: '',
        monthsToPayOff: '',
        hasInsurance: false,
        insuranceValue: '',
        usage: 'WorkInstrument',
        owners_id: [],
    });

    const [membros, setMembros] = useState([]);


    // Atualiza o estado do formulário quando um input className='survey-control' muda
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSelectChange = (selectedOptions) => {
        setFormData({
            ...formData,
            owners_id: selectedOptions ? selectedOptions.map(option => option.value) : [],
        });
    };


    // Envia o formulário para o servidor
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Aqui você incluiria a lógica para enviar os dados para o servidor
        console.log(formData);

        const token = localStorage.getItem('token');
        try {

            const response = await api.post("/candidates/vehicle-info", {
                vehicleType: formData.vehicleType,
                modelAndBrand: formData.modelAndBrand,
                manufacturingYear: Number(formData.manufacturingYear),
                situation: formData.situation,
                financedMonths: Number(formData.financedMonths) || undefined,
                monthsToPayOff: Number(formData.monthsToPayOff) || undefined,
                hasInsurance: formData.hasInsurance,
                insuranceValue: Number(formData.insuranceValue) || undefined,
                usage: formData.usage,
                owners_id: formData.owners_id,
            }, {
                headers: {
                    'authorization': `Bearer ${token}`,
                }
            })
            console.log('====================================');
            console.log(response.data);
            console.log('====================================');
            alert("Registro criado com sucesso")
        }
        catch (err) {
            alert(err)
        }
    };

    useEffect(() => {
        async function pegarMembros() {
            const token = localStorage.getItem('token');
            try {

                const response = await api.get("/candidates/family-member", {
                    headers: {
                        'authorization': `Bearer ${token}`,
                    }
                })
                console.log('====================================');
                console.log(response.data);
                console.log('====================================');
                const membrosdaFamilia = response.data.familyMembers
                setMembros(membrosdaFamilia)
            }
            catch (err) {
                alert(err)
            }
        }
        pegarMembros()

    }, [])

    return (
        <div className='fill-box'>
            <form onSubmit={handleSubmit} id='survey-form'>

                <div className='box-select'>
                    <label>Proprietários</label>
                    <br />
                    <Select
                        isMulti
                        name="owners_id"
                        options={membros.map(membro => ({
                            value: membro.id,
                            label: membro.fullName // Substitua 'nome' pela propriedade que contém o nome do membro da família
                        }))}
                        className="survey-select"
                        onChange={handleSelectChange}
                        value={membros
                            .filter(membro => formData.owners_id.includes(membro.id))
                            .map(membro => ({
                                value: membro.id,
                                label: membro.fullName // Substitua 'nome' pela propriedade que contém o nome do membro da família
                            }))}
                    />
                </div>
                <div className='survey-box'>
                    <label >Tipo de Veículo:</label>
                    <br />
                    <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} required>
                        <option value="">Selecione</option>
                        {VehicleType.map((type) => (
                            <option key={type.value} value={type.value}>{type.label}</option>))}
                    </select>
                </div>

                <div className='survey-box'>
                    <label >Modelo e Marca:</label>
                    <br />

                    <input className='survey-control' type="text" name="modelAndBrand" value={formData.modelAndBrand} onChange={handleChange} required />
                </div>

                <div className='survey-box'>
                    <label >Ano de Fabricação:</label>
                    <br />

                    <input className='survey-control' type="number" name="manufacturingYear" value={formData.manufacturingYear} onChange={handleChange} required />
                </div>

                <div className='survey-box'>
                    <label >Situação do Veículo:</label>
                    <br />

                    <select name="situation" value={formData.situation} onChange={handleChange} required>
                        {VehicleSituation.map((type) => (
                            <option key={type.value} value={type.value}>{type.label}</option>))}
                    </select>
                </div>

                {/* Renderiza condicionalmente campos adicionais se o veículo estiver financiado */}
                {formData.situation === 'Financed' && (
                    <>
                        <div className='survey-box'>
                            <label >Meses Financiados:</label>
                            <br />

                            <input className='survey-control' type="number" name="financedMonths" value={formData.financedMonths} onChange={handleChange} />
                        </div>
                        <div className='survey-box'>
                            <label>Meses para Quitação:</label>
                            <br />

                            <input className='survey-control' type="number" name="monthsToPayOff" value={formData.monthsToPayOff} onChange={handleChange} />
                        </div>
                    </>
                )}

                <div className='survey-box'>
                    <label >Possui Seguro?</label>
                    <br />

                    <input className='survey-control' type="checkbox" name="hasInsurance" checked={formData.hasInsurance} onChange={handleChange} />
                </div>

                {/* Renderiza condicionalmente o campo de valor do seguro se o seguro estiver marcado */}
                {formData.hasInsurance && (
                    <div className='survey-box'>
                        <label >Valor do Seguro:</label>
                        <br />

                        <input className='survey-control' type="number" name="insuranceValue" value={formData.insuranceValue} onChange={handleChange} />
                    </div>
                )}

                <div className='survey-box'>
                    <label >Uso do Veículo:</label>
                    <br />

                    <select name="usage" value={formData.usage} onChange={handleChange} required>
                        {VehicleUsage.map((type) => (
                            <option key={type.value} value={type.value}>{type.label}</option>))}
                    </select>
                </div>


                <button type="submit">Cadastrar Veículo</button>
            </form>
        </div>
    );
};

