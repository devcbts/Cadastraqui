import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss';

export default function Declaration_ChildPension({ onBack, onNext, onNoPension }) {
    const [childReceivesPension, setChildReceivesPension] = useState(null);
    const [declarationData, setDeclarationData] = useState(null);
    const [childPensionRecipients, setChildPensionRecipients] = useState('');
    const [payerName, setPayerName] = useState('');
    const [payerCpf, setPayerCpf] = useState('');
    const [amount, setAmount] = useState('');

    useEffect(() => {
        const savedData = localStorage.getItem('declarationData');
        if (savedData) {
            setDeclarationData(JSON.parse(savedData));
        }
    }, []);

    const handleRadioChange = (event) => {
        setChildReceivesPension(event.target.value === 'yes');
    };

    const handleNext = () => {
        if (childReceivesPension === null) {
            alert('Por favor, selecione uma opção antes de avançar.');
            return;
        }

        if (childReceivesPension === true && (!childPensionRecipients || !payerName || !payerCpf || !amount)) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const pensionData = {
            childReceivesPension,
            childPensionRecipients: childReceivesPension ? childPensionRecipients : '',
            payerName: childReceivesPension ? payerName : '',
            payerCpf: childReceivesPension ? payerCpf : '',
            amount: childReceivesPension ? amount : '',
        };
        localStorage.setItem('childPensionData', JSON.stringify(pensionData));
        if (childReceivesPension) {
            onNext();
        } else {
            onNoPension();
        }
    };

    const isSaveDisabled = childReceivesPension === null || (childReceivesPension === true && (!childPensionRecipients || !payerName || !payerCpf || !amount));

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>RECEBIMENTO OU AUSÊNCIA DE RECEBIMENTO DE PENSÃO ALIMENTÍCIA</h2>
            <h3>{declarationData.fullName}</h3>
            <div className={commonStyles.declarationContent}>
                <label>B - Algum filho recebe pensão alimentícia?</label>
                <div className={commonStyles.radioGroup}>
                    <input
                        type="radio"
                        id="childYes"
                        name="childPension"
                        value="yes"
                        onChange={handleRadioChange}
                        checked={childReceivesPension === true}
                    />
                    <label htmlFor="childYes">Sim</label>
                    <input
                        type="radio"
                        id="childNo"
                        name="childPension"
                        value="no"
                        onChange={handleRadioChange}
                        checked={childReceivesPension === false}
                    />
                    <label htmlFor="childNo">Não</label>
                </div>
                {childReceivesPension && (
                    <div className={commonStyles.additionalFields}>
                        <div className={commonStyles.inputGroup}>
                            <label htmlFor="childPensionRecipients">Selecione todos que recebem pensão</label>
                            <input
                                type="text"
                                id="childPensionRecipients"
                                name="childPensionRecipients"
                                value={childPensionRecipients}
                                onChange={(e) => setChildPensionRecipients(e.target.value)}
                                placeholder="Carlos da Silva, Fulana da Silva"
                            />
                        </div>
                        <div className={commonStyles.inputGroup}>
                            <label htmlFor="payerName">Nome do Pagador da Pensão</label>
                            <input
                                type="text"
                                id="payerName"
                                name="payerName"
                                value={payerName}
                                onChange={(e) => setPayerName(e.target.value)}
                                placeholder="Joana de Gizman Londres"
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
                                placeholder="524.321.789-09"
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
                                placeholder="550,00"
                            />
                        </div>
                    </div>
                )}
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleNext}
                    disabled={isSaveDisabled}
                    style={{
                        borderColor: isSaveDisabled ? '#ccc' : '#1F4B73',
                        cursor: isSaveDisabled ? 'not-allowed' : 'pointer',
                        opacity: isSaveDisabled ? 0.6 : 1
                    }}
                />
                <ButtonBase
                    onClick={handleNext}
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
