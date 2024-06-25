import React, { useState } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_RentIncomeDetails({ onBack, onSave }) {
    const [rentDetails, setRentDetails] = useState({
        cep: '',
        address: '',
        neighborhood: '',
        number: '',
        city: '',
        uf: '',
        complement: '',
        landlordName: '',
        landlordCpf: '',
        rentAmount: '' // Adicionei rentAmount aqui
    });

    const handleSave = () => {
        localStorage.setItem('rentDetails', JSON.stringify(rentDetails));
        onSave(); // Navega para a próxima tela
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRentDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÃO DE RECEBIMENTO DE ALUGUEL</h1>
            <h2>João da Silva - usuário do Cadastraqui</h2>
            <p>Preencha os dados do endereço do imóvel que você recebe aluguel:</p>
            <div className={commonStyles.inputGroup}>
                <label>CEP</label>
                <input
                    type="text"
                    name="cep"
                    value={rentDetails.cep}
                    onChange={handleInputChange}
                    placeholder="14701-340"
                />
            </div>
            <div className={commonStyles.inputGroup}>
                <label>Endereço</label>
                <input
                    type="text"
                    name="address"
                    value={rentDetails.address}
                    onChange={handleInputChange}
                    placeholder="Rua José Francisco Paschoal"
                />
            </div>
            <div className={commonStyles.inputGroup}>
                <label>Bairro</label>
                <input
                    type="text"
                    name="neighborhood"
                    value={rentDetails.neighborhood}
                    onChange={handleInputChange}
                    placeholder="Centro"
                />
            </div>
            <div className={commonStyles.inputGroup}>
                <label>Número</label>
                <input
                    type="text"
                    name="number"
                    value={rentDetails.number}
                    onChange={handleInputChange}
                    placeholder="60"
                />
            </div>
            <div className={commonStyles.inputGroup}>
                <label>Cidade</label>
                <input
                    type="text"
                    name="city"
                    value={rentDetails.city}
                    onChange={handleInputChange}
                    placeholder="Bebedouro"
                />
            </div>
            <div className={commonStyles.inputGroup}>
                <label>UF</label>
                <input
                    type="text"
                    name="uf"
                    value={rentDetails.uf}
                    onChange={handleInputChange}
                    placeholder="SP"
                />
            </div>
            <div className={commonStyles.inputGroup}>
                <label>Complemento</label>
                <input
                    type="text"
                    name="complement"
                    value={rentDetails.complement}
                    onChange={handleInputChange}
                    placeholder="Sala 456"
                />
            </div>
            <div className={commonStyles.inputGroup}>
                <label>Nome do Locatário</label>
                <input
                    type="text"
                    name="landlordName"
                    value={rentDetails.landlordName}
                    onChange={handleInputChange}
                    placeholder="Nome do Locatário"
                />
            </div>
            <div className={commonStyles.inputGroup}>
                <label>CPF do Locatário</label>
                <input
                    type="text"
                    name="landlordCpf"
                    value={rentDetails.landlordCpf}
                    onChange={handleInputChange}
                    placeholder="999.999.999-99"
                />
            </div>
            <div className={commonStyles.inputGroup}>
                <label>Valor do Aluguel</label>
                <input
                    type="text"
                    name="rentAmount"
                    value={rentDetails.rentAmount}
                    onChange={handleInputChange}
                    placeholder="Valor do aluguel"
                />
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Salvar" onClick={handleSave} />
            </div>
        </div>
    );
}
