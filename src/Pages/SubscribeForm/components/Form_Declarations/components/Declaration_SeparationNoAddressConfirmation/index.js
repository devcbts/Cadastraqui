import React, { useState, useEffect } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_SeparationNoAddressConfirmation({ onBack, onNext }) {
    const [separationDetails, setSeparationDetails] = useState(null);

    useEffect(() => {
        const savedSeparationDetails = localStorage.getItem('separationDetails');
        if (savedSeparationDetails) {
            setSeparationDetails(JSON.parse(savedSeparationDetails));
        }
    }, []);

    if (!separationDetails) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE SEPARAÇÃO DE FATO (NÃO JUDICIAL)</h2>
            <h3>João da Silva - usuário do Cadastraqui</h3>
            <div className={commonStyles.declarationContent}>
                <p>
                    Me separei de <strong>{separationDetails.personName}</strong>, inscrito(a) no CPF nº <strong>{separationDetails.personCpf}</strong>, desde <strong>{separationDetails.separationDate}</strong>.
                    Meu(minha) ex-companheiro(a) reside em local que não tenho conhecimento.
                    Até o presente momento não formalizei o encerramento de nossa relação por meio de divórcio.
                </p>
                <p>Confirma a declaração?</p>
                <div className={commonStyles.radioGroup}>
                    <label>
                        <input type="radio" name="confirmation" value="sim" /> Sim
                    </label>
                    <label>
                        <input type="radio" name="confirmation" value="nao" /> Não
                    </label>
                </div>
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Salvar" onClick={onNext} />
            </div>
        </div>
    );
}
