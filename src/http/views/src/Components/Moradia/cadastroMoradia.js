import React, { useState } from 'react';
import axios from 'axios';

const PropertyStatus = [
    { value: 'OwnPaidOff', label: 'Própria e quitada' },
    { value: 'OwnFinanced', label: 'Própria e financiada' },
    { value: 'Rented', label: 'Alugada' },
    { value: 'ProvidedByEmployer', label: 'Cedida pelo empregador' },
    { value: 'ProvidedByFamily', label: 'Cedida pela família' },
    { value: 'ProvidedOtherWay', label: 'Cedida de outra forma' },
    { value: 'Irregular', label: 'Irregular' },
];

const ContractType = [
    { value: 'Verbal', label: 'Verbal' },
    { value: 'ThroughRealEstateAgency', label: 'Através de imobiliária' },
    { value: 'DirectWithOwner', label: 'Direto com o proprietário' },
];

const TimeLivingInProperty = [
    { value: 'UpTo11Months', label: 'Até 11 meses' },
    { value: 'From1To10Years', label: 'De 1 a 10 anos' },
    { value: 'From10To20Years', label: 'De 10 a 20 anos' },
    { value: 'Over20Years', label: 'Mais de 20 anos' },
];

const DomicileType = [
    { value: 'House', label: 'Casa' },
    { value: 'CondominiumHouse', label: 'Casa em condomínio' },
    { value: 'Apartment', label: 'Apartamento' },
    { value: 'RoomingHouse', label: 'Casa de cômodos' },
];

const NumberOfRooms = [
    { value: 'One', label: 'Um' },
    { value: 'Two', label: 'Dois' },
    { value: 'Three', label: 'Três' },
    { value: 'Four', label: 'Quatro' },
    { value: 'Five', label: 'Cinco' },
    { value: 'Six', label: 'Seis' },
    { value: 'Seven', label: 'Sete' },
    { value: 'Eight', label: 'Oito' },
    { value: 'Nine', label: 'Nove' },
    { value: 'Ten', label: 'Dez' },
    { value: 'Eleven', label: 'Onze' },
    { value: 'Twelve', label: 'Doze' },
];

const CadastroMoradia = () => {
    const [formData, setFormData] = useState({
        grantorName: '',
        propertyStatus: '',
        contractType: '',
        timeLivingInProperty: '',
        domicileType: '',
        numberOfRooms: '',
        numberOfBedrooms: 0,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/moradia', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    // Aqui você adicionaria o token de autorização se necessário
                    // 'Authorization': `Bearer ${token}`,
                },
            });
            console.log(response.data);
            // Tratar a resposta conforme necessário
        } catch (error) {
            console.error(error.response.data);
            // Tratar o erro conforme necessário
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Nome do cedente:
                <input type="text" name="grantorName" value={formData.grantorName} onChange={handleChange} required />
            </label>
            <label>
                Status da propriedade:
                <select name="propertyStatus" value={formData.propertyStatus} onChange={handleChange} required>
                    {PropertyStatus.map((status) => <option value={status.value}>{status.label}</option>)}
                </select>
            </label>
            <label>
                Tipo de contrato:
                <select name="contractType" value={formData.contractType} onChange={handleChange} required>
                    {ContractType.map((type) => <option value={type.value}>{type.label}</option>)}
                </select>
            </label>
            <label>
                Tempo vivendo na propriedade:
                <select name="timeLivingInProperty" value={formData.timeLivingInProperty} onChange={handleChange} required>
                    {TimeLivingInProperty.map((time) => <option value={time.value}>{time.label}</option>)}
                </select>
            </label>
            <label>
                Tipo de domicílio:
                <select name="domicileType" value={formData.domicileType} onChange={handleChange} required>
                    {DomicileType.map((type) => <option value={type.value}>{type.label}</option>)}
                </select>
            </label>
            <label>
                Número de cômodos:
                <select name="numberOfRooms" value={formData.numberOfRooms} onChange={handleChange} required>
                    {NumberOfRooms.map((number) => <option value={number.value}>{number.label}</option>)}
                </select>
            </label>
            <label>
                Número de quartos:
                <input type="number" name="numberOfBedrooms" value={formData.numberOfBedrooms} onChange={handleChange} min="0" required />
            </label>
            <label>
                Número de quartos:
                <input type="number" name="numberOfBedrooms" value={formData.numberOfBedrooms} onChange={handleChange} min="0" required />
            </label>
            <button type="submit">Enviar</button>
        </form>

    );
};

export default CadastroMoradia;
