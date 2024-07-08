import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import { useRecoilState } from 'recoil';
import declarationAtom from '../../atoms/declarationAtom';

export default function Declaration_StableUnion({ onBack, onSave }) {
    const [confirmation, setConfirmation] = useState(null);
    const [partnerName, setPartnerName] = useState('');
    const [unionStartDate, setUnionStartDate] = useState('');
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);

    useEffect(() => {
        if (declarationData.stableUnion) {
            const { confirmation, partnerName, unionStartDate } = declarationData.stableUnion
            setConfirmation(confirmation)
            setPartnerName(partnerName)
            setUnionStartDate(unionStartDate)
        }
        // const savedData = localStorage.getItem('declarationData');
        // if (savedData) {
        //     setDeclarationData(JSON.parse(savedData));
        // }
    }, []);

    const handleSave = () => {
        if (confirmation && partnerName && unionStartDate) {
            setDeclarationData((prev) => ({ ...prev, stableUnion: { confirmation, partnerName, unionStartDate } }))
        } else if (!confirmation) {
            setDeclarationData((prev) => ({ ...prev, stableUnion: { confirmation, partnerName: '', unionStartDate: '' } }))
        }
        onSave(confirmation);
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    const isSaveDisabled = () => {
        if (confirmation) {
            return !partnerName || !unionStartDate;
        }
        return confirmation === null;
    };

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE UNIÃO ESTÁVEL</h2>
            <h3>{declarationData.name}</h3>
            <p>Convive em união estável com alguém?</p>
            <div className={commonStyles.radioGroup}>
                <label>
                    <input type="radio" name="stableUnion" value="sim" onChange={() => setConfirmation(true)} checked={confirmation} /> Sim
                </label>
                <label>
                    <input type="radio" name="stableUnion" value="nao" onChange={() => setConfirmation(false)} checked={confirmation === false} /> Não
                </label>
            </div>
            {confirmation && (
                <div className={commonStyles.additionalFields}>
                    <div className={commonStyles.inputGroup}>
                        <label htmlFor="partnerName">Nome do Parceiro</label>
                        <input
                            type="text"
                            id="partnerName"
                            name="partnerName"
                            value={partnerName}
                            onChange={(e) => setPartnerName(e.target.value)}
                            placeholder="Nome do Parceiro"
                        />
                    </div>
                    <div className={commonStyles.inputGroup}>
                        <label htmlFor="unionStartDate">Data de início da União Estável</label>
                        <input
                            type="date"
                            id="unionStartDate"
                            name="unionStartDate"
                            value={unionStartDate}
                            onChange={(e) => setUnionStartDate(e.target.value)}
                        />
                    </div>
                </div>
            )}
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleSave}
                    disabled={isSaveDisabled()}
                    style={{
                        borderColor: isSaveDisabled() ? '#ccc' : '#1F4B73',
                        cursor: isSaveDisabled() ? 'not-allowed' : 'pointer',
                        opacity: isSaveDisabled() ? 0.6 : 1
                    }}
                />
            </div>
        </div>
    );
}
