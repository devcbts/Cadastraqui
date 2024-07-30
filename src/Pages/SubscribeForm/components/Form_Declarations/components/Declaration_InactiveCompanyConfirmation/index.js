import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import candidateService from 'services/candidate/candidateService';
import declarationAtom from '../../atoms/declarationAtom';
import commonStyles from '../../styles.module.scss';

export default function Declaration_InactiveCompanyConfirmation({ onBack, onSave, userId }) {
    const { auth } = useAuth();
    const [confirmation, setConfirmation] = useState(null);
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);
    const [inactiveCompanyDetails, setInactiveCompanyDetails] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (declarationData.inactiveCompanyDetails) {
            setInactiveCompanyDetails(declarationData.inactiveCompanyDetails.companyDetails)
        }

    }, []);

    const handleRegisterDeclaration = async () => {
        if (confirmation === false) {
            setError('Por favor, verifique os dados de cadastro.');
            return;
        }

        if (!auth?.uid) {
            console.error('UID não está definido');
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            console.error('Token não está definido');
            return;
        }

        if (!declarationData || !inactiveCompanyDetails) {
            console.error('Os dados da declaração ou da empresa inativa não estão disponíveis');
            return;
        }

        const text = `
            Eu, ${declarationData.name}, portador(a) do CPF nº ${declarationData.CPF}, possuo uma empresa inativa cuja razão social é ${inactiveCompanyDetails.socialReason}, inscrita sob o CNPJ ${inactiveCompanyDetails.CNPJ}, localizada no endereço ${inactiveCompanyDetails.address}, nº ${inactiveCompanyDetails.addressNumber}, complemento ${inactiveCompanyDetails.complement}, bairro ${inactiveCompanyDetails.neighborhood}, cidade ${inactiveCompanyDetails.city}, UF ${inactiveCompanyDetails.UF}, CEP ${inactiveCompanyDetails.CEP}.
        `;

        const payload = {
            declarationExists: confirmation,
            ...(confirmation && { text })
        };

        try {
            await candidateService.registerDeclaration({ section: 'InactiveCompany', id: declarationData.id, data: payload })

            // const response = await fetch(`${process.env.REACT_APP_API_URL}/candidates/declaration/InactiveCompany/${declarationData.id}`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${token}`
            //     },
            //     body: JSON.stringify(payload)
            // });

            // if (!response.ok) {
            //     throw new Error(`Erro: ${response.statusText}`);
            // }

            // const data = await response.json();
            // ;

            onSave(confirmation);
        } catch (error) {
            console.error('Erro ao registrar a declaração:', error);
        }
    };

    const isSaveDisabled = !declarationData || !inactiveCompanyDetails || confirmation === null;

    if (!declarationData || !inactiveCompanyDetails) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h2 className={commonStyles.declarationFormTitle}>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h2>
            <h3 className={commonStyles.declarationFormSubTitle}>DECLARAÇÃO DE EMPRESA INATIVA</h3>
            <h3 className={commonStyles.declarationFormNameTitle}>{declarationData.name}</h3>
            <div className={commonStyles.declarationContent}>
                <p>
                    Eu, <span>{declarationData.name}</span>, portador(a) do CPF nº <span>{declarationData.CPF}</span>, possuo uma empresa inativa, cuja razão social é <span>{inactiveCompanyDetails.socialReason}</span>, inscrita sob o CNPJ <span>{inactiveCompanyDetails.CNPJ}</span> localizada no endereço <span>{inactiveCompanyDetails.address}</span>, nº <span>{inactiveCompanyDetails.addressNumber}</span>, complemento <span>{inactiveCompanyDetails.complement}</span>, bairro <span>{inactiveCompanyDetails.neighborhood}</span>, cidade <span>{inactiveCompanyDetails.city}</span>, UF <span>{inactiveCompanyDetails.UF}</span>, CEP <span>{inactiveCompanyDetails.CEP}</span>.
                </p>
            </div>
            <p className={commonStyles.declarationConfirm}>Confirma a declaração?</p>
            <div className={commonStyles.radioGroupInput}>
                <label>
                    <input
                        type="radio"
                        name="confirmation"
                        value="sim"
                        checked={confirmation}
                        onChange={() => setConfirmation(true)}
                    /> Sim
                </label>
                <label>
                    <input
                        type="radio"
                        name="confirmation"
                        value="nao"
                        checked={confirmation === false}
                        onChange={() => setConfirmation(false)}
                    /> Não
                </label>
            </div>
            {error && <div className={commonStyles.error} style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleRegisterDeclaration}
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
