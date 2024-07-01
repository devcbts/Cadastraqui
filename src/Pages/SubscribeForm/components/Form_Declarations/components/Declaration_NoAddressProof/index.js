import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import useAuth from 'hooks/useAuth'; // Certifique-se de que o caminho está correto
import { useEffect, useState } from 'react';
import { api } from 'services/axios'; // Certifique-se de que o caminho está correto
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto

export default function Declaration_NoAddressProof({ onBack, onNext }) {
    const [declarationData, setDeclarationData] = useState(null);
    const [hasConfirmed, setHasConfirmed] = useState(null);
    const { auth } = useAuth(); // Obtendo o auth do contexto

    useEffect(() => {
        const fetchDeclarationData = async () => {
            try {
                const response = await api.get(`/candidates/declaration/Form/${auth.uid}`);
                const data = response.data.infoDetails;
                setDeclarationData(data);
            } catch (error) {
                console.error('Erro ao buscar os dados da declaração:', error);
            }
        };

        fetchDeclarationData();
    }, [auth.uid]);

    const handleSave = async () => {
        if (!auth?.uid) {
            console.error('UID não está definido');
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            console.error('Token não está definido');
            return;
        }

        if (!declarationData) {
            console.error('Os dados da declaração não estão disponíveis');
            return;
        }

        const text = `
            Eu, ${declarationData.fullName}, resido na ${declarationData.address}, nº ${declarationData.addressNumber}, complemento, 
            CEP: ${declarationData.CEP}, bairro ${declarationData.neighborhood}, cidade ${declarationData.city}, estado ${declarationData.state}, 
            UF ${declarationData.UF}, e-mail: ${declarationData.email}, declaro que não possuo comprovante de endereço em meu nome. Por ser 
            a expressão da verdade e, ciente que a falsidade de informação sujeitará às penas da legislação pertinente, confirmo a presente 
            declaração para efeitos legais.
        `;

        const payload = {
            declarationExists: hasConfirmed === 'sim',
            ...(hasConfirmed === 'sim' && { text })
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/candidates/declaration/NoAddressProof/${auth.uid}`, {
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
            onNext(hasConfirmed === 'sim');
        } catch (error) {
            console.error('Erro ao registrar a declaração:', error);
        }
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE AUSÊNCIA DE COMPROVANTE DE ENDEREÇO EM NOME</h2>
            <h3>{declarationData.fullName}</h3>
            <div className={commonStyles.declarationContent}>
                <p>
                    Eu, <strong>{declarationData.fullName}</strong>, resido na <strong>{declarationData.address}</strong>, nº <strong>{declarationData.addressNumber}</strong>, complemento,
                    CEP: <strong>{declarationData.CEP}</strong>, bairro <strong>{declarationData.neighborhood}</strong>, cidade <strong>{declarationData.city}</strong>, estado <strong>{declarationData.state}</strong>,
                    UF <strong>{declarationData.UF}</strong>, e-mail: <strong>{declarationData.email}</strong>, declaro que não possuo comprovante de endereço em meu nome. Por ser
                    a expressão da verdade e, ciente que a falsidade de informação sujeitará às penas da legislação pertinente, confirmo a presente
                    declaração para efeitos legais.
                </p>
                <p>Confirma a declaração?</p>
                <div className={commonStyles.radioButtons}>
                    <label>
                        <input type="radio" name="confirmation" value="sim" onChange={() => setHasConfirmed('sim')} /> Sim
                    </label>
                    <label>
                        <input type="radio" name="confirmation" value="nao" onChange={() => setHasConfirmed('nao')} /> Não
                    </label>
                </div>
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Salvar" onClick={handleSave} />
            </div>
        </div>
    );
}
