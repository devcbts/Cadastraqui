import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto

export default function Declaration_ResponsibilityConfirmation({ onBack, onNext, userId }) {
    console.log('Declaration_ResponsibilityConfirmation renderizado'); // Log para debug
    const { auth } = useAuth();
    const [confirmation, setConfirmation] = useState('sim'); // Inicialize como 'sim'
    const [declarationData, setDeclarationData] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem('declarationData');
        if (savedData) {
            setDeclarationData(JSON.parse(savedData));
        }
    }, []);

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

        if (!declarationData) {
            console.error('Os dados da declaração não estão disponíveis');
            return;
        }

        const text = `
            Estou ciente e assumo, inteira responsabilidade pelas informações contidas neste instrumento e em relação as informações prestadas no decorrer do preenchimento deste formulário eletrônico e documentos anexados, estando consciente que a apresentação de documento falso e/ou a falsidade nas informações implicará nas penalidades cabíveis, previstas nos artigos 298 e 299 do Código Penal Brasileiro, bem como sobre a condição prevista no caput e § 2º do art. 26 da Lei Complementar nº 187, de 16 de dezembro de 2021.
            Art. 26. Os alunos beneficiários das bolsas de estudo de que trata esta Lei Complementar, ou seus pais ou responsáveis, quando for o caso, respondem legalmente pela veracidade e pela autenticidade das informações por eles prestadas, e as informações prestadas pelas instituições de ensino superior (IES) acerca dos beneficiários em qualquer âmbito devem respeitar os limites estabelecidos pela Lei nº 13.709, de 14 de agosto de 2018.
            § 2º As bolsas de estudo poderão ser canceladas a qualquer tempo em caso de constatação de falsidade da informação prestada pelo bolsista ou por seus pais ou seu responsável, ou de inidoneidade de documento apresentado, sem prejuízo das demais sanções cíveis e penais cabíveis, sem que o ato do cancelamento resulte em prejuízo à entidade beneficente concedente, inclusive na apuração das proporções exigidas nesta Seção, salvo se comprovada negligência ou má-fé da entidade beneficente.
        `;

        const payload = {
            declarationExists: confirmation === 'sim',
            ...(confirmation === 'sim' && { text })
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
            onNext();
        } catch (error) {
            console.error('Erro ao registrar a declaração:', error);
        }
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÃO INTEIRA RESPONSABILIDADE PELAS INFORMAÇÕES CONTIDAS NESTE INSTRUMENTO</h1>
            <h2>{declarationData.fullName}</h2>
            <div className={commonStyles.declarationContent}>
                <p>
                    Estou ciente e assumo, inteira responsabilidade pelas informações contidas neste instrumento e em relação as informações prestadas no decorrer do preenchimento deste formulário eletrônico e documentos anexados, estando consciente que a apresentação de documento falso e/ou a falsidade nas informações implicará nas penalidades cabíveis, previstas nos artigos 298 e 299 do Código Penal Brasileiro, bem como sobre a condição prevista no caput e § 2º do art. 26 da Lei Complementar nº 187, de 16 de dezembro de 2021.
                </p>
                <p>
                    Art. 26. Os alunos beneficiários das bolsas de estudo de que trata esta Lei Complementar, ou seus pais ou responsáveis, quando for o caso, respondem legalmente pela veracidade e pela autenticidade das informações por eles prestadas, e as informações prestadas pelas instituições de ensino superior (IES) acerca dos beneficiários em qualquer âmbito devem respeitar os limites estabelecidos pela Lei nº 13.709, de 14 de agosto de 2018.
                </p>
                <p>
                    § 2º As bolsas de estudo poderão ser canceladas a qualquer tempo em caso de constatação de falsidade da informação prestada pelo bolsista ou por seus pais ou seu responsável, ou de inidoneidade de documento apresentado, sem prejuízo das demais sanções cíveis e penais cabíveis, sem que o ato do cancelamento resulte em prejuízo à entidade beneficente concedente, inclusive na apuração das proporções exigidas nesta Seção, salvo se comprovada negligência ou má-fé da entidade beneficente.
                </p>
                <p>Confirma a declaração?</p>
                <div className={commonStyles.radioGroup}>
                    <label>
                        <input
                            type="radio"
                            name="confirmation"
                            value="sim"
                            checked={confirmation === 'sim'}
                            onChange={() => setConfirmation('sim')}
                        /> Sim
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="confirmation"
                            value="nao"
                            checked={confirmation === 'nao'}
                            onChange={() => setConfirmation('nao')}
                        /> Não
                    </label>
                </div>
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase label="Salvar" onClick={handleRegisterDeclaration} />
            </div>
        </div>
    );
}
