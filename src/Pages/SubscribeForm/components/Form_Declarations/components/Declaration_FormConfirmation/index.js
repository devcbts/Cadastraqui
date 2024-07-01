import ButtonBase from "Components/ButtonBase";
import useAuth from 'hooks/useAuth';
import { useState } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto

export default function Declaration_Form({ onEdit, declarationData }) {
    const { auth } = useAuth();
    const [declarationExists, setDeclarationExists] = useState(true);

    const handleRegisterDeclaration = async () => {
        if (!auth?.uid) {
            console.error('UID não está definido');
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            console.error('Token não está definido');
            return;
        }

        const text = `
            Eu, ${declarationData.fullName}, portador(a) da cédula de identidade RG nº ${declarationData.RG}, órgão emissor ${declarationData.rgIssuingAuthority}, UF do órgão emissor ${declarationData.rgIssuingState} ou portador(a) da ${declarationData.documentType}, número ${declarationData.documentNumber}, validade ${declarationData.documentValidity}, inscrito(a) no CPF nº ${declarationData.CPF}, nacionalidade ${declarationData.nationalidade}, estado civil ${declarationData.maritalStatus}, profissão ${declarationData.profession}, residente na ${declarationData.address}, nº ${declarationData.addressNumber}, complemento, CEP: ${declarationData.CEP}, bairro ${declarationData.neighborhood}, cidade ${declarationData.city}, estado ${declarationData.UF}, UF ${declarationData.UF}, e-mail: ${declarationData.email}, responsável legal por (quando for o caso, incluir os nomes dos menores de idade do grupo familiar), declaro para os devidos fins do processo seletivo realizado nos termos da Lei Complementar nº 187, de 16 de dezembro de 2021 que:
        `;

        const payload = {
            declarationExists,
            ...(declarationExists && { text })
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/candidates/declaration/Form/${auth.uid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Erro: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Declaração registrada:', data);

            // Redireciona para a próxima tela
            onEdit();
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
            <h2>{declarationData.fullName} </h2>
            <div className={commonStyles.declarationContent}>
                <p>
                    Eu, <span>{declarationData.fullName}</span>, portador(a) da cédula de identidade RG nº <span>{declarationData.RG}</span>, órgão emissor <span>{declarationData.rgIssuingAuthority}</span>, UF do órgão emissor <span>{declarationData.rgIssuingState}</span> ou portador(a) da <span>{declarationData.documentType}</span>, número <span>{declarationData.documentNumber}</span>, validade <span>{declarationData.documentValidity}</span>, inscrito(a) no <span>CPF</span> nº <span>{declarationData.CPF}</span>, nacionalidade <span>{declarationData.nationalidade}</span>, estado civil <span>{declarationData.maritalStatus}</span>, profissão <span>{declarationData.profession}</span>, residente na <span>{declarationData.address}</span>, nº <span>{declarationData.addressNumber}</span>, complemento, <span>CEP: {declarationData.CEP}</span>, bairro {declarationData.neighborhood}, cidade <span>{declarationData.city}</span>, estado <span>{declarationData.UF}</span>, UF <span>{declarationData.UF}</span>, e-mail: <span>{declarationData.email}</span>, responsável legal por (quando for o caso, incluir os nomes dos menores de idade do grupo familiar), declaro para os devidos fins do processo seletivo realizado nos termos da Lei Complementar nº 187, de 16 de dezembro de 2021 que:
                </p>
                <div className={commonStyles.radioGroup}>
                    <label>Todas as informações estão corretas?</label>
                    <div>
                        <input
                            type="radio"
                            id="yes"
                            name="infoCorrect"
                            value="yes"
                            checked={declarationExists}
                            onChange={() => setDeclarationExists(true)}
                        />
                        <label htmlFor="yes">Sim</label>
                        <input
                            type="radio"
                            id="no"
                            name="infoCorrect"
                            value="no"
                            checked={!declarationExists}
                            onChange={() => setDeclarationExists(false)}
                        />
                        <label htmlFor="no">Não</label>
                    </div>
                </div>
            </div>
            <div className={commonStyles.centeredButton}>
                <ButtonBase onClick={handleRegisterDeclaration}>Salvar</ButtonBase>
            </div>
        </div>
    );
}
