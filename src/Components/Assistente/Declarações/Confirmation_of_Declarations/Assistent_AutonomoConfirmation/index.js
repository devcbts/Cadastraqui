import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss';

export default function Assistent_AutonomoConfirmation({ onBack }) {
    const [declarationData, setDeclarationData] = useState(null);
    const [autonomoDetails, setAutonomoDetails] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('declarationData');
        const savedAutonomoDetails = localStorage.getItem('autonomoDetails');
        if (savedData) {
            setDeclarationData(JSON.parse(savedData));
        }
        if (savedAutonomoDetails) {
            setAutonomoDetails(JSON.parse(savedAutonomoDetails));
        }
    }, []);

    if (!declarationData || !autonomoDetails) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÃO DE AUTÔNOMO(A)/RENDA INFORMAL</h1>
            <h2>{declarationData.fullName}</h2>
            <div className={commonStyles.declarationContent}>
                <p>
                    Eu, <span>{declarationData.fullName}</span>, portador(a) do CPF nº <span>{declarationData.CPF}</span>, desenvolvo atividades <span>{autonomoDetails.activity}</span> e recebo uma quantia média de R$ 2500,00 mensal.
                </p>
            </div>
            <div className={commonStyles.radioGroup}>
                <label>
                    <input type="radio" name="confirmation" value="sim" disabled /> Sim
                </label>
                <label>
                    <input type="radio" name="confirmation" value="nao" disabled /> Não
                </label>
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase
                    onClick={onBack}
                    disabled={!declarationData || !autonomoDetails}
                    style={{
                        borderColor: !declarationData || !autonomoDetails ? '#ccc' : '#1F4B73',
                        cursor: !declarationData || !autonomoDetails ? 'not-allowed' : 'pointer',
                        opacity: !declarationData || !autonomoDetails ? 0.6 : 1
                    }}
                >
                    <Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} />
                </ButtonBase>
            </div>
        </div>
    );
}
