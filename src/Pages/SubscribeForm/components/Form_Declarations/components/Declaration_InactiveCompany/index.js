import React, { useState, useEffect } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_InactiveCompany({ onBack, onSave }) {
    const [hasInactiveCompany, setHasInactiveCompany] = useState(null);
    const [companyDetails, setCompanyDetails] = useState({
        cep: '',
        address: '',
        neighborhood: '',
        number: '',
        city: '',
        uf: '',
        complement: '',
    });
    const [declarationData, setDeclarationData] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('declarationData');
        if (savedData) {
            setDeclarationData(JSON.parse(savedData));
        }
    }, []);

    const handleSave = () => {
        if (hasInactiveCompany !== null) {
            localStorage.setItem('inactiveCompanyDetails', JSON.stringify({ hasInactiveCompany, companyDetails }));
            onSave(hasInactiveCompany);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCompanyDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÃO DE EMPRESA INATIVA</h1>
            <h2>{declarationData.fullName} - usuário do Cadastraqui</h2>
            <p>Você possui alguma empresa inativa?</p>
            <div className={commonStyles.radioGroup}>
                <label>
                    <input type="radio" name="hasInactiveCompany" value="sim" onChange={() => setHasInactiveCompany('sim')} /> Sim
                </label>
                <label>
                    <input type="radio" name="hasInactiveCompany" value="nao" onChange={() => setHasInactiveCompany('nao')} /> Não
                </label>
            </div>
            {hasInactiveCompany === 'sim' && (
                <div className={commonStyles.additionalFields}>
                    <div className={commonStyles.inputGroup}>
                        <label htmlFor="cep">CEP</label>
                        <input
                            type="text"
                            id="cep"
                            name="cep"
                            value={companyDetails.cep}
                            onChange={handleInputChange}
                            placeholder="78910-111"
                        />
                    </div>
                    <div className={commonStyles.inputGroup}>
                        <label htmlFor="address">Endereço</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={companyDetails.address}
                            onChange={handleInputChange}
                            placeholder="Rua das Flores"
                        />
                    </div>
                    <div className={commonStyles.inputGroup}>
                        <label htmlFor="neighborhood">Bairro</label>
                        <input
                            type="text"
                            id="neighborhood"
                            name="neighborhood"
                            value={companyDetails.neighborhood}
                            onChange={handleInputChange}
                            placeholder="Jardim Primavera"
                        />
                    </div>
                    <div className={commonStyles.inputGroup}>
                        <label htmlFor="number">Número</label>
                        <input
                            type="text"
                            id="number"
                            name="number"
                            value={companyDetails.number}
                            onChange={handleInputChange}
                            placeholder="123"
                        />
                    </div>
                    <div className={commonStyles.inputGroup}>
                        <label htmlFor="city">Cidade</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={companyDetails.city}
                            onChange={handleInputChange}
                            placeholder="Rio de Janeiro"
                        />
                    </div>
                    <div className={commonStyles.inputGroup}>
                        <label htmlFor="uf">UF</label>
                        <input
                            type="text"
                            id="uf"
                            name="uf"
                            value={companyDetails.uf}
                            onChange={handleInputChange}
                            placeholder="RJ"
                        />
                    </div>
                    <div className={commonStyles.inputGroup}>
                        <label htmlFor="complement">Complemento</label>
                        <input
                            type="text"
                            id="complement"
                            name="complement"
                            value={companyDetails.complement}
                            onChange={handleInputChange}
                            placeholder="Sala 456"
                        />
                    </div>
                </div>
            )}
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Salvar" onClick={handleSave} />
            </div>
        </div>
    );
}
