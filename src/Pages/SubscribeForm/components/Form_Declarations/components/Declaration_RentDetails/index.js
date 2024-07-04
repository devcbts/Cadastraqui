import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss';

export default function Declaration_RentDetails({ onBack, onSave }) {
    const [rentValue, setRentValue] = useState('');
    const [landlordName, setLandlordName] = useState('');
    const [landlordCpf, setLandlordCpf] = useState('');
    const [declarationData, setDeclarationData] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('declarationData');
        if (savedData) {
            setDeclarationData(JSON.parse(savedData));
        }
    }, []);

    const handleSave = () => {
        if (!rentValue || !landlordName || !landlordCpf) {
            alert('Por favor, preencha todos os campos antes de salvar.');
            return;
        }

        const rentDetails = {
            rentValue,
            landlordName,
            landlordCpf
        };
        localStorage.setItem('rentDetails', JSON.stringify(rentDetails));
        onSave();
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE IMÓVEL ALUGADO - SEM CONTRATO DE ALUGUEL</h2>
            <h3>{declarationData.fullName}</h3>
            <div className={commonStyles.declarationContent}>
                <div className={commonStyles.inputGroup}>
                    <label>Valor do aluguel</label>
                    <input
                        type="text"
                        placeholder="R$ 550,00"
                        value={rentValue}
                        onChange={(e) => setRentValue(e.target.value)}
                    />
                </div>
                <div className={commonStyles.inputGroup}>
                    <label>Nome do Locador</label>
                    <input
                        type="text"
                        placeholder="Fulano de Tal"
                        value={landlordName}
                        onChange={(e) => setLandlordName(e.target.value)}
                    />
                </div>
                <div className={commonStyles.inputGroup}>
                    <label>CPF do Locador</label>
                    <input
                        type="text"
                        placeholder="123.456.789-10"
                        value={landlordCpf}
                        onChange={(e) => setLandlordCpf(e.target.value)}
                    />
                </div>
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleSave}
                    disabled={!rentValue || !landlordName || !landlordCpf}
                    style={{
                        borderColor: !rentValue || !landlordName || !landlordCpf ? '#ccc' : '#1F4B73',
                        cursor: !rentValue || !landlordName || !landlordCpf ? 'not-allowed' : 'pointer',
                        opacity: !rentValue || !landlordName || !landlordCpf ? 0.6 : 1
                    }}
                />
            </div>
        </div>
    );
}
