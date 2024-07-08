import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss';
import { NotificationService } from 'services/notification';
import uploadService from 'services/upload/uploadService';
import useAuth from 'hooks/useAuth';
import { useRecoilState } from 'recoil';
import declarationAtom from '../../atoms/declarationAtom';

export default function Declaration_MEI({ onBack, onNext }) {
    const [mei, setMei] = useState(null);
    const [file, setFile] = useState(null);
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);

    useEffect(() => {
        if (declarationData.mei) {
            setMei(declarationData.mei)
        }

    }, []);
    const { auth } = useAuth()
    const handleSave = async () => {
        setDeclarationData((prev) => ({ ...prev, mei }))
        if (mei !== null && (mei ? file : true)) {
            if (mei && file) {
                try {
                    const formData = new FormData()
                    formData.append("file_MEI", file)
                    await uploadService.uploadBySectionAndId({ section: 'declaracoes', id: auth?.uid }, formData)
                    localStorage.setItem('meiDetails', JSON.stringify({ file: file.name }));
                    NotificationService.success({ text: 'Documento enviado' })
                } catch (err) {
                }
            }
            onNext(mei);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files?.[0]);
    };

    const isSaveDisabled = () => {
        if (mei) {
            return !file;
        }
        return mei === null;
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE RENDIMENTOS - MEI</h2>
            <h3>{declarationData.name}</h3>
            <p>Você possui o cadastro de Microempreendedor Individual?</p>
            <div className={commonStyles.radioGroup}>
                <label>
                    <input type="radio" name="mei" value="sim" onChange={() => setMei(true)} checked={mei} /> Sim
                </label>
                <label>
                    <input type="radio" name="mei" value="nao" onChange={() => setMei(false)} checked={mei === false} /> Não
                </label>
            </div>
            {mei && (
                <>
                    <p>Anexar Declaração Anual do Simples Nacional para o(a) Microempreendedor(a) Individual (DAS-SIMEI).</p>
                    <input type="file" onChange={handleFileChange} accept='application/pdf' />
                </>
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
