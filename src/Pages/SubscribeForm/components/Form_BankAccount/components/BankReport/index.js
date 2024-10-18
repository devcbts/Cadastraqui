import { ReactComponent as Arrow } from "Assets/icons/arrow.svg";
import ButtonBase from "Components/ButtonBase";
import FormFilePicker from "Components/FormFilePicker";
import Loader from "Components/Loader";
import Table from "Components/Table";
import Tooltip from "Components/Tooltip";
import useControlForm from "hooks/useControlForm";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import candidateService from "services/candidate/candidateService";
import { NotificationService } from "services/notification";
import uploadService from "services/upload/uploadService";
import bankReportSchema from "./schemas/bank-report-schema";
import styles from './styles.module.scss';
import METADATA_FILE_TYPE from "utils/file/metadata-file-type";
import METADATA_FILE_CATEGORY from "utils/file/metadata-file-category";
import CCSFile from "./components/CCSFile";
import FormListItem from "Pages/SubscribeForm/components/FormList/FormListItem";
import FormList from "Pages/SubscribeForm/components/FormList";
import Indicator from "Components/Indicator";
import useBankReport from "./useBankReport";
export default function BankReport({ id, onBack }) {

    const { data, handleUploadFile, isLoading, readOnlyUser } = useBankReport({ id })
    const [selection, setSelection] = useState("none")

    return (
        <>
            <Loader loading={isLoading} />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h1>{new Date().toLocaleString('pt-br', { year: 'numeric', month: 'long' }).toUpperCase()}</h1>
                    <h1>Relatório de Contas e Relacionamentos (CCS)</h1>
                </div>
                {selection === "none" && <div>
                    <FormList.Root>
                        <FormList.List list={[
                            { value: 'registrato' },
                            { value: 'pix' },
                        ]} render={(item) => {
                            const status = data?.find(e => e.tableName === item.value)
                            return (
                                <FormListItem.Root text={item.value.toUpperCase()}>
                                    <FormListItem.Actions>
                                        <Indicator
                                            status={!status ? null : (status.status === "UPDATED")}
                                        />
                                        <ButtonBase label={'visualizar'} onClick={() => setSelection(item.value)} />
                                    </FormListItem.Actions>
                                </FormListItem.Root>
                            )
                        }}>


                        </FormList.List>
                    </FormList.Root>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '80%' }}>

                        <ButtonBase onClick={onBack}><Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                    </div>
                </div>}

                {selection === "registrato" && <CCSFile
                    fieldName={"bankReport"}
                    title={'Registrato'}
                    onBack={() => setSelection("none")}
                    onSend={readOnlyUser ? null : (file) => handleUploadFile("registrato", file)}
                    currentFile={data?.find(e => e.tableName === "registrato")}
                >
                    <div style={{ alignSelf: 'center' }}>

                        <Tooltip tooltip={'Não possui ainda o seu relatório de contas e relacionamento do mês atual? Clique em Gerar relatório'}>
                            <a href="https://www.bcb.gov.br/meubc/registrato" target="_blank" rel="noreferrer">
                                <ButtonBase label={'gerar relatório'} />
                            </a>
                        </Tooltip>
                    </div>
                </CCSFile>}
                {selection === "pix" && <CCSFile
                    fieldName={"pix"}
                    title={'Chaves PIX'}
                    onBack={() => setSelection("none")}
                    onSend={readOnlyUser ? null : (file) => handleUploadFile("pix", file)}
                    currentFile={data?.find(e => e.tableName === "pix")}


                />}

            </div>
        </>
    )
}

