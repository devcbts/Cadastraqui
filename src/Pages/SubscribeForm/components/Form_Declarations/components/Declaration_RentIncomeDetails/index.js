import React, { useState } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_RentIncomeDetails({ onBack, onSave }) {
    const [rentDetails, setRentDetails] = useState({
        cep: '',
        endereco: '',
        bairro: '',
        numero: '',
        cidade: '',
        uf: '',
        complemento: '',
        locatarioNome: '',
        locatarioCpf: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRentDetails((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÃO DE RECEBIMENTO DE ALUGUEL</h1>
            <h2>João da Silva - usuário do Cadastraqui</h2>
            <p>Preencha os dados do endereço do Imóvel que você recebe aluguel</p>
            <div className={commonStyles.inputGroup}>
                <label>CEP</label>
                <input type="text" name="cep" value={rentDetails.cep} onChange={handleInputChange} />
            </div>
            <div className={commonStyles.inputGroup}>
                <label>Endereço</label>
                <input type="text" name="endereco" value={rentDetails.endereco} onChange={handleInputChange} />
            </div>
            <div className={commonStyles.inputGroup}>
                <label>Bairro</label>
                <input type="text" name="bairro" value={rentDetails.bairro} onChange={handleInputChange} />
            </div>
            <div className={commonStyles.inputGroup}>
                <label>Número</label>
                <input type="text" name="numero" value={rentDetails.numero} onChange={handleInputChange} />
            </div>
            <div className={commonStyles.inputGroup}>
                <label>Cidade</label>
                <input type="text" name="cidade" value={rentDetails.cidade} onChange={handleInputChange} />
            </div>
            <div className={commonStyles.inputGroup}>
                <label>UF</label>
                <input type="text" name="uf" value={rentDetails.uf} onChange={handleInputChange} />
            </div>
            <div className={commonStyles.inputGroup}>
                <label>Complemento</label>
                <input type="text" name="complemento" value={rentDetails.complemento} onChange={handleInputChange} />
            </div>
            <div className={commonStyles.inputGroup}>
                <label>Nome do Locatário</label>
                <input type="text" name="locatarioNome" value={rentDetails.locatarioNome} onChange={handleInputChange} />
            </div>
            <div className={commonStyles.inputGroup}>
                <label>CPF do Locatário</label>
                <input type="text" name="locatarioCpf" value={rentDetails.locatarioCpf} onChange={handleInputChange} />
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Salvar" onClick={() => onSave(rentDetails)} />
            </div>
        </div>
    );
}
