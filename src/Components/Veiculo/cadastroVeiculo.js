import React, { useState, useEffect } from 'react';
import './cadastroVeiculo.css'
import Select from 'react-select'
import { api } from '../../services/axios';
import InputCheckbox from '../Inputs/InputCheckbox';
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
export default function CadastroVeiculo({ candidate }) {
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
        candidate_id: '',
        reponsible_id: ''
    });

    const [membros, setMembros] = useState([]);
    const [candidato, setCandidato] = useState({ id: candidate.id, nome: candidate.name });

    // Combine as opções de membros da família e candidato
    const opcoes = [...membros.map(m => ({ value: m.id, label: m.fullName, type: 'family' })),
    { value: candidato.id, label: candidato.nome, type: 'candidate' }];

    // Atualiza o estado do formulário quando um input className='survey-control' muda
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSelectChange = (selectedOptions) => {
        // Filtra para membros da família
        const owners = selectedOptions.filter(option => option.type === 'family').map(option => option.value);
        // Verifica se o candidato foi selecionado
        const candidate = selectedOptions.find(option => option.type === 'candidate')?.value;
        const role = localStorage.getItem('role');
        if (role === 'RESPONSIBLE') {
            setFormData({
                ...formData,
                owners_id: owners,
                responsible_id: candidate || '',
            });
        }
        else{

            setFormData({
                ...formData,
                owners_id: owners,
                candidate_id: candidate || '',
            });
        }
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
                candidate_id: formData.candidate_id || undefined,
                responsible_id: formData.reponsible_id || undefined,
            }, {
                headers: {
                    'authorization': `Bearer ${token}`,
                }
            })
            console.log('====================================');
            console.log(response.data);
            console.log('====================================');
            alert("Dados cadastrados com sucesso!")
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
                        options={opcoes}
                        className="survey-select"
                        onChange={handleSelectChange}
                        value={opcoes.filter(option =>
                            formData.owners_id.includes(option.value) || option.value === formData.candidate_id
                        )}
                    />
                </div>
                <div className='survey-box'>
                    <label >Tipo de Veículo:</label>
                    <br />
                    <select             class="select-data"  name="vehicleType" value={formData.vehicleType} onChange={handleChange} required>
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

                    <select class="select-data" name="situation" value={formData.situation} onChange={handleChange} required>
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

                <div className='survey-box survey-check'>
                    <label >Possui Seguro?</label>
                    <br />

                    <InputCheckbox id='hasInsurance' className='survey-control' type="checkbox" name="hasInsurance" checked={formData.hasInsurance} onChange={handleChange} />
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

                    <select class="select-data" name="usage" value={formData.usage} onChange={handleChange} required>
                        {VehicleUsage.map((type) => (
                            <option key={type.value} value={type.value}>{type.label}</option>))}
                    </select>
                </div>


                <button type="button" className='over-button'>Cadastrar Veículo</button>
            </form>
        </div>
    );
};

