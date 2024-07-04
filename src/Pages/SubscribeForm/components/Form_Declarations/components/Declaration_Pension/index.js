import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss';

export default function Declaration_Pension({ onBack, onNext }) {
    const [receivesPension, setReceivesPension] = useState(null);
    const [payerName, setPayerName] = useState('');
    const [payerCpf, setPayerCpf] = useState('');
    const [amount, setAmount] = useState('');
    const [declarationData, setDeclarationData] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('declarationData');
        if (savedData) {
            setDeclarationData(JSON.parse(savedData));
        }
    }, []);

    const handleRadioChange = (event) => {
        setReceivesPension(event.target.value === 'yes');
    };

    const handleSave = () => {
        if (receivesPension === null) {
            alert('Por favor, selecione uma opção antes de avançar.');
            return;
        }

        if (receivesPension === true && (!payerName || !payerCpf || !amount)) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const pensionData = {
            receivesPension,
            payerName,
            payerCpf,
            amount,
        };
        localStorage.setItem('pensionData', JSON.stringify(pensionData));
        onNext();
    };

    const isSaveDisabled = receivesPension === null || (receivesPension === true && (!payerName || !payerCpf || !amount));

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>RECEBIMENTO OU AUSÊNCIA DE RECEBIMENTO DE PENSÃO ALIMENTÍCIA</h2>
            <h3>{declarationData.fullName}</h3>
            <div className={commonStyles.declarationContent}>
                <label>A - Você recebe pensão alimentícia?</label>
                <div className={commonStyles.radioGroup}>
                    <input
                        type="radio"
                        id="yes"
                        name="pension"
                        value="yes"
                        onChange={handleRadioChange}
                        checked={receivesPension === true}
                    />
                    <label htmlFor="yes">Sim</label>
                    <input
                        type="radio"
                        id="no"
                        name="pension"
                        value="no"
                        onChange={handleRadioChange}
                        checked={receivesPension === false}
                    />
                    <label htmlFor="no">Não</label>
                </div>
                {receivesPension && (
                    <div className={commonStyles.additionalFields}>
                        <div className={commonStyles.inputGroup}>
                            <label htmlFor="payerName">Nome do Pagador da Pensão</label>
                            <input
                                type="text"
                                id="payerName"
                                name="payerName"
                                value={payerName}
                                onChange={(e) => setPayerName(e.target.value)}
                            />
                        </div>
                        <div className={commonStyles.inputGroup}>
                            <label htmlFor="payerCpf">CPF do Pagador da Pensão</label>
                            <input
                                type="text"
                                id="payerCpf"
                                name="payerCpf"
                                value={payerCpf}
                                onChange={(e) => setPayerCpf(e.target.value)}
                            />
                        </div>
                        <div className={commonStyles.inputGroup}>
                            <label htmlFor="amount">Valor</label>
                            <input
                                type="text"
                                id="amount"
                                name="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleSave}
                    disabled={isSaveDisabled}
                    style={{
                        borderColor: isSaveDisabled ? '#ccc' : '#1F4B73',
                        cursor: isSaveDisabled ? 'not-allowed' : 'pointer',
                        opacity: isSaveDisabled ? 0.6 : 1
                    }}
                />
                <ButtonBase
                    onClick={handleSave}
                    disabled={isSaveDisabled}
                    style={{
                        borderColor: isSaveDisabled ? '#ccc' : '#1F4B73',
                        cursor: isSaveDisabled ? 'not-allowed' : 'pointer',
                        opacity: isSaveDisabled ? 0.6 : 1
                    }}
                >
                    <Arrow width="40px" />
                </ButtonBase>
            </div>
        </div>
    );
}
