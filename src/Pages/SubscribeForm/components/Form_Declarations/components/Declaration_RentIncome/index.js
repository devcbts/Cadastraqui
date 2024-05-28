import React, { useState } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto

export default function Declaration_RentIncome({ onBack, onNext }) {
    const [receivesRent, setReceivesRent] = useState(null);

    const handleNext = () => {
        onNext(receivesRent === 'sim');
    };

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÃO DE RECEBIMENTO DE ALUGUEL</h1>
            <h2>João da Silva - usuário do Cadastraqui</h2>
            <p>Você recebe rendimento de imóvel alugado?</p>
            <div className={commonStyles.radioGroup}>
                <label>
                    <input type="radio" name="receivesRent" value="sim" onChange={() => setReceivesRent('sim')} /> Sim
                </label>
                <label>
                    <input type="radio" name="receivesRent" value="não" onChange={() => setReceivesRent('não')} /> Não
                </label>
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Salvar" onClick={handleNext} />
            </div>
        </div>
    );
}
