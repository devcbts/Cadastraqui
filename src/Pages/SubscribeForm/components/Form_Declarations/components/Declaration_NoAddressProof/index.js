import React, { useState, useEffect } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto
import { api } from 'services/axios'; // Certifique-se de que o caminho está correto

export default function Declaration_NoAddressProof({ onBack, onNext }) {
    const [declarationData, setDeclarationData] = useState(null);
    const [hasConfirmed, setHasConfirmed] = useState(null);
    const userId = "uid_do_usuario"; // Defina o userId ou obtenha-o de props/contexto

    useEffect(() => {
        const fetchDeclarationData = async () => {
            try {
                const response = await api.get(`/candidates/declaration/Form/${userId}`);
                const data = response.data.infoDetails;
                setDeclarationData(data);
            } catch (error) {
                console.error('Erro ao buscar os dados da declaração:', error);
            }
        };

        fetchDeclarationData();
    }, [userId]);

    const handleSave = () => {
        if (hasConfirmed === 'sim') {
            onNext(true);
        }
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE AUSÊNCIA DE COMPROVANTE DE ENDEREÇO EM NOME</h2>
            <h3>{declarationData.fullName} - usuário do Cadastraqui</h3>
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
