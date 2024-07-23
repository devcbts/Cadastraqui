import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss';

export default function Assistent_EmpresarioConfirmation({ onBack }) {
    const [declarationData, setDeclarationData] = useState(null);
    const [empresarioDetails, setEmpresarioDetails] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('declarationData');
        const savedEmpresarioDetails = localStorage.getItem('empresarioDetails');
        if (savedData) {
            setDeclarationData(JSON.parse(savedData));
        }
        if (savedEmpresarioDetails) {
            setEmpresarioDetails(JSON.parse(savedEmpresarioDetails));
        }
    }, []);

    if (!declarationData || !empresarioDetails) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÃO DE RENDA DE EMPRESÁRIO</h1>
            <h2>{declarationData.name}</h2>
            <div className={commonStyles.declarationContent}>
                <p>
                    Eu, <span>{declarationData.name}</span>, portador(a) do CPF nº <span>{declarationData.CPF}</span>, sou sócio de uma empresa e exerço a atividade: <span>{empresarioDetails.activity}</span>.
                </p>
            </div>
            <p className={commonStyles.declarationConfirm}>Confirma a declaração?</p>
            <div className={commonStyles.radioGroupInput}>
                <label>
                    <input type="radio" name="confirmation" value="sim" disabled /> Sim
                </label>
                <label>
                    <input type="radio" name="confirmation" value="nao" disabled /> Não
                </label>
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
            </div>
        </div>
    );
}
