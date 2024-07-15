import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import { useState } from 'react';
import commonStyles from '../../styles.module.scss';
import findLabel from 'utils/enums/helpers/findLabel';
import MARITAL_STATUS from 'utils/enums/marital-status';

export default function DeclarationForm({ onBack, onEdit, userId, declarationData, type }) {
    const [infoCorrect, setInfoCorrect] = useState(null);

    const handleRegisterDeclaration = async () => {
        if (!userId) {
            console.error('USERID não está definido');
            return;
        }

        try {
            const response = await fetch(`/declaration/${type}/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: generateDeclarationText(declarationData),
                    declarationExists: infoCorrect === "yes"
                })
            });
            const data = await response.json();
            ;
        } catch (error) {
            console.error('Erro ao registrar a declaração:', error);
        }
    };

    const generateDeclarationText = (data) => {
        return `Eu, ${data.fullName}, portador(a) da cédula de identidade RG nº ${data.RG}, órgão emissor ${data.rgIssuingAuthority}, UF do órgão emissor ${data.rgIssuingState} ou portador(a) da ${data.documentType}, número ${data.documentNumber}, validade ${data.documentValidity}, inscrito(a) no CPF nº ${data.CPF}, nacionalidade ${data.nationality}, estado civil ${findLabel(MARITAL_STATUS, data.maritalStatus)}, profissão ${data.profession}, residente na ${data.address}, nº ${data.addressNumber}, complemento, CEP: ${data.CEP}, bairro ${data.neighborhood}, cidade ${data.city}, estado ${data.UF}, UF ${data.UF}, e-mail: ${data.email}, responsável legal por (quando for o caso, incluir os nomes dos menores de idade do grupo familiar), declaro para os devidos fins do processo seletivo realizado nos termos da Lei Complementar nº 187, de 16 de dezembro de 2021 que:`;
    };

    if (!declarationData) {
        return <div>Carregando...</div>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>{declarationData.name} </h2>
            <div className={commonStyles.declarationContent}>
                <p>{generateDeclarationText(declarationData)}</p>
                <div className={commonStyles.radioGroup}>
                    <label>Todas as informações estão corretas?</label>
                    <div>
                        <input
                            type="radio"
                            id="yes"
                            name="infoCorrect"
                            value="yes"
                            onChange={(e) => setInfoCorrect(e.target.value)}
                        />
                        <label htmlFor="yes">Sim</label>
                        <input
                            type="radio"
                            id="no"
                            name="infoCorrect"
                            value="no"
                            onChange={(e) => setInfoCorrect(e.target.value)}
                        />
                        <label htmlFor="no">Não</label>
                    </div>
                </div>
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Editar" onClick={onEdit} />
                <ButtonBase onClick={handleRegisterDeclaration}>Registrar Declaraçãooooo</ButtonBase>
            </div>
        </div>
    );
}
