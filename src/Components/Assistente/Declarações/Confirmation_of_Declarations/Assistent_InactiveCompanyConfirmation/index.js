import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import declarationAtom from 'Pages/SubscribeForm/components/Form_Declarations/atoms/declarationAtom';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import commonStyles from '../../styles.module.scss';

export default function Assistent_InactiveCompanyConfirmation({ onBack }) {
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);
    const [inactiveCompanyDetails, setInactiveCompanyDetails] = useState(null);

    useEffect(() => {
        if (declarationData.inactiveCompanyDetails) {
            setInactiveCompanyDetails(declarationData.inactiveCompanyDetails)
        }
        // const savedData = localStorage.getItem('declarationData');
        // const savedInactiveCompanyDetails = localStorage.getItem('inactiveCompanyDetails');
        // if (savedData) {
        //     setDeclarationData(JSON.parse(savedData));
        // }
        // if (savedInactiveCompanyDetails) {
        //     setInactiveCompanyDetails(JSON.parse(savedInactiveCompanyDetails));
        // }
    }, []);

    if (!declarationData || !inactiveCompanyDetails) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÃO DE EMPRESA INATIVA</h1>
            <h2>{declarationData.name}</h2>
            <div className={commonStyles.declarationContent}>
                <p>
                    Eu, <span>{declarationData.name}</span>, portador(a) do CPF nº <span>{declarationData.CPF}</span>, possuo uma empresa inativa cuja razão social é <span>{inactiveCompanyDetails.socialReason}</span>, inscrita sob o CNPJ <span>{inactiveCompanyDetails.CNPJ}</span>, localizada no endereço <span>{inactiveCompanyDetails.address}</span>, nº <span>{inactiveCompanyDetails.number}</span>, complemento <span>{inactiveCompanyDetails.complement}</span>, bairro <span>{inactiveCompanyDetails.neighborhood}</span>, cidade <span>{inactiveCompanyDetails.city}</span>, UF <span>{inactiveCompanyDetails.uf}</span>, CEP <span>{inactiveCompanyDetails.cep}</span>.
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
