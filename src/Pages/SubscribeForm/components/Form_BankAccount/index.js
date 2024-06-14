import useStepFormHook from "Pages/SubscribeForm/hooks/useStepFormHook";
import MemberBankAccountView from "./components/MemberBankAccountView";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'
import BankAccount from "./components/BankAccount";
import { useEffect, useState } from "react";
import candidateService from "services/candidate/candidateService";
import { NotificationService } from "services/notification";
import BankMonthSelection from "./components/BankMonthSelection";
import StatementSelection from "./components/Statement";
import incomeAtom from "../Form_Income/atoms/income-atom";
import { useRecoilValue } from "recoil";
import monthAtom from "Components/MonthSelection/atoms/month-atom";
import uploadService from "services/upload/uploadService";
import createFileForm from "utils/create-file-form";
import useAuth from "hooks/useAuth";

export default function FormBankAccount({ id }) {
    const hasMonthSelected = useRecoilValue(monthAtom)
    const handleUploadStatements = async (data, tableId) => {
        console.log('files', data)
        const formData = createFileForm(data)
        try {
            await uploadService.uploadBySectionAndId({ section: 'statement', id, tableId }, formData)
        } catch (err) {
            NotificationService.error({ text: 'Erro ao enviar os arquivos' })
        }
    }

    const handleEditAccount = async (data, parsedData) => {
        try {
            await candidateService.updateBankingAccount(data.id, data)
            await handleUploadStatements(parsedData, data.id)
            NotificationService.success({ text: 'Dados bancários alterados' })
        } catch (err) {
            NotificationService.error({ text: err.response?.data?.message })
        }
    }
    const handleSave = async (data) => {
        try {
            const bankId = await candidateService.registerBankingAccount(id, data)
            await handleUploadStatements(data, bankId)
            NotificationService.success({ text: 'Dados bancários cadastrados' })
            setData(null)
            setIsAdding(false)
        } catch (err) {
            NotificationService.error({ text: err.response?.data?.message })
        }
    }
    const [renderList, setRenderList] = useState([])
    useEffect(() => {
        setRenderList([
            BankAccount,
            BankMonthSelection
        ])
    }, [])
    const {
        Steps,
        state: { data, activeStep, setData },
        max,
        pages: { previous, next },
        actions: { handleEdit }

    } = useStepFormHook({
        render: renderList,
        onEdit: handleEditAccount,
        onSave: handleSave
    })
    const [isAdding, setIsAdding] = useState(false)
    const handleAddNewAccount = () => {
        // TODO: pass member_id to the initial data when adding new account
        setData(null)
        setIsAdding(true)
    }
    const handleSelectAccount = (account) => {
        setIsAdding(false)
        setData(account)
    }
    const isFormAvailable = () => {
        return !!data || isAdding
    }
    const handlePrevious = () => {
        if (activeStep === 1) {
            setData(null)
            setIsAdding(false)
            return
        }
        previous()
    }
    return (
        <>
            {!isFormAvailable() && <MemberBankAccountView id={id} onSelect={handleSelectAccount} onAdd={handleAddNewAccount} />}
            {isFormAvailable() && <>
                <Steps />
                {!hasMonthSelected && <div className={commonStyles.actions}>
                    <ButtonBase onClick={handlePrevious}>
                        <Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} />
                    </ButtonBase>


                    {!isAdding && <ButtonBase onClick={handleEdit} label={"editar"} />}

                    {activeStep !== max &&
                        <ButtonBase onClick={next}>
                            <Arrow width="40px" />
                        </ButtonBase>
                    }
                    {
                        (activeStep === max && isAdding) && (
                            <ButtonBase onClick={next}>
                                Salvar
                            </ButtonBase>
                        )
                    }

                </div>}
            </>}
        </ >
    )
}