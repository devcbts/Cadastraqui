import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import commonStyles from '../../styles.module.scss';

export default function Assistent_Declaration_Form({ onBack, userId, declarationData }) {
    const handleRegisterDeclaration = async () => {
        if (!userId) {
            console.error('USERID não está definido');
            return;
        }

        try {
            const response = await fetch(`/declaration/Form/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: "Texto gerado na declaração" })
            });
            const data = await response.json();
            ;
        } catch (error) {
            console.error('Erro ao registrar a declaração:', error);
        }
    };

    if (!declarationData) {
        return <div>Carregando...</div>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>{declarationData.name} </h2>
            <div className={commonStyles.declarationContent}>
                <p>
                    Eu, <span>{declarationData.name}</span>, portador(a) da cédula de identidade RG nº <span>{declarationData.RG}</span>, órgão emissor <span>{declarationData.rgIssuingAuthority}</span>, UF do órgão emissor <span>{declarationData.rgIssuingState}</span> ou portador(a) da <span>{declarationData.documentType}</span>, número <span>{declarationData.documentNumber}</span>, validade <span>{declarationData.documentValidity}</span>, inscrito(a) no <span>CPF</span> nº <span>{declarationData.CPF}</span>, nacionalidade <span>{declarationData.nationalidade}</span>, estado civil <span>{declarationData.maritalStatus}</span>, profissão <span>{declarationData.profession}</span>, residente na <span>{declarationData.address}</span>, nº <span>{declarationData.addressNumber}</span>, complemento, <span>CEP: {declarationData.CEP}</span>, bairro {declarationData.neighborhood}, cidade <span>{declarationData.city}</span>, estado <span>{declarationData.UF}</span>, UF <span>{declarationData.UF}</span>, e-mail: <span>{declarationData.email}</span>, responsável legal por (quando for o caso, incluir os nomes dos menores de idade do grupo familiar), declaro para os devidos fins do processo seletivo realizado nos termos da Lei Complementar nº 187, de 16 de dezembro de 2021 que:
                </p>
                <div className={commonStyles.radioGroup}>
                    <label>Todas as informações estão corretas?</label>
                    <div>
                        <input type="radio" id="yes" name="infoCorrect" value="yes" disabled />
                        <label htmlFor="yes">Sim</label>
                        <input type="radio" id="no" name="infoCorrect" value="no" disabled />
                        <label htmlFor="no">Não</label>
                    </div>
                </div>
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase onClick={handleRegisterDeclaration}>Registrar Declaração</ButtonBase>
            </div>
        </div>
    );
}
