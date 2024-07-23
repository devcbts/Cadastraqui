import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import { useState } from 'react';
import commonStyles from '../../styles.module.scss';

export default function Assistent_ActivitConfirmation({ onBack }) {
    const [declarationData, setDeclarationData] = useState(null);

    // useEffect(() => {
    //     const savedData = localStorage.getItem('declarationData');
    //     if (savedData) {
    //         setDeclarationData(JSON.parse(savedData));
    //     }
    // }, []);

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÃO DE AUSÊNCIA DE RENDA (DESEMPREGADO(A) OU DO LAR)</h1>
            <h2>{declarationData.name}</h2>
            <p>
                Eu, <span>{declarationData.name}</span>, portador(a) do CPF nº <span>{declarationData.CPF}</span>, residente e domiciliado(a) à <span>{declarationData.address}</span>, nº <span>{declarationData.addressNumber}</span>, complemento, CEP: <span>{declarationData.CEP}</span>, bairro <span>{declarationData.neighborhood}</span>, cidade <span>{declarationData.city}</span>, UF <span>{declarationData.UF}</span>, e-mail: <span>{declarationData.email}</span>, declaro para os devidos fins e sob as penas da lei, que não exerço nenhuma atividade remunerada, seja ela formal ou informal, não possuindo, portanto, nenhuma fonte de renda.
            </p>
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
