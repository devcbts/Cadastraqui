import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import { useState } from 'react';
import commonStyles from '../../styles.module.scss';

export default function Declaration_CurrentAddress({ onBack, onNext }) {
    const [addressDetails, setAddressDetails] = useState({
        cep: '',
        address: '',
        neighborhood: '',
        number: '',
        city: '',
        uf: '',
        complement: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddressDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSave = () => {
        localStorage.setItem('addressDetails', JSON.stringify(addressDetails));
        onNext();
    };

    const isSaveDisabled = !addressDetails.cep || !addressDetails.address || !addressDetails.neighborhood || !addressDetails.number || !addressDetails.city || !addressDetails.uf;

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE SEPARAÇÃO DE FATO (NÃO JUDICIAL)</h2>
            <h3>João da Silva</h3>
            <div className={commonStyles.declarationContent}>
                <div className={commonStyles.inputGroup}>
                    <label>CEP</label>
                    <input
                        type="text"
                        name="cep"
                        value={addressDetails.cep}
                        onChange={handleInputChange}
                        placeholder="14701-340"
                    />
                </div>
                <div className={commonStyles.inputGroup}>
                    <label>Endereço</label>
                    <input
                        type="text"
                        name="address"
                        value={addressDetails.address}
                        onChange={handleInputChange}
                        placeholder="Rua José Francisco Paschoal"
                    />
                </div>
                <div className={commonStyles.inputGroup}>
                    <label>Bairro</label>
                    <input
                        type="text"
                        name="neighborhood"
                        value={addressDetails.neighborhood}
                        onChange={handleInputChange}
                        placeholder="Centro"
                    />
                </div>
                <div className={commonStyles.inputGroup}>
                    <label>Número</label>
                    <input
                        type="text"
                        name="number"
                        value={addressDetails.number}
                        onChange={handleInputChange}
                        placeholder="60"
                    />
                </div>
                <div className={commonStyles.inputGroup}>
                    <label>Cidade</label>
                    <input
                        type="text"
                        name="city"
                        value={addressDetails.city}
                        onChange={handleInputChange}
                        placeholder="Bebedouro"
                    />
                </div>
                <div className={commonStyles.inputGroup}>
                    <label>UF</label>
                    <input
                        type="text"
                        name="uf"
                        value={addressDetails.uf}
                        onChange={handleInputChange}
                        placeholder="SP"
                    />
                </div>
                <div className={commonStyles.inputGroup}>
                    <label>Complemento</label>
                    <input
                        type="text"
                        name="complement"
                        value={addressDetails.complement}
                        onChange={handleInputChange}
                        placeholder="Complemento"
                    />
                </div>
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase 
                    label="Salvar" 
                    onClick={handleSave} 
                    disabled={isSaveDisabled}
                    style={{
                        borderColor: isSaveDisabled ? '#ccc' : '#1F4B73',
                        cursor: isSaveDisabled ? 'not-allowed' : 'pointer',
                        opacity: isSaveDisabled ? 0.6 : 1
                    }}
                />
            </div>
        </div>
    );
}
