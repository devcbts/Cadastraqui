import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'
import ButtonBase from "Components/ButtonBase"
import CheckboxBase from "Components/CheckboxBase"
import RowTextAction from "Components/RowTextAction"
import FormList from "Pages/SubscribeForm/components/FormList"
import FormListItem from "Pages/SubscribeForm/components/FormList/FormListItem"
import { useEffect, useRef, useState } from "react"
import candidateService from "services/candidate/candidateService"
import { NotificationService } from "services/notification"
import BankReport from "../BankReport"
export default function MemberBankAccountView({ id, onSelect, onBack, onAdd }) {
    const [isLoading, setIsLoading] = useState(true)
    const [bankingInfo, setBankingInfo] = useState([])
    const isMounted = useRef(null)
    // TODO: fetch bank account information from SPECIFIC USER
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const information = await candidateService.getBankingAccountById(id)
                setBankingInfo(information)
            } catch (err) {

            }
            setIsLoading(false)
        }
        fetchData()
    }, [])
    const handleRemove = (id) => {
        const remove = async () => {
            try {
                await candidateService.removeBankingAccount(id)
                setBankingInfo((prev) => ({ ...prev, accounts: prev.accounts.filter(account => account.id !== id) }))
                NotificationService.success({ text: 'Conta bancária excluída' })
            } catch (err) {
                NotificationService.error({ text: err?.response?.data?.message })
            }
        }
        NotificationService.confirm({
            onConfirm: remove,
            text: 'Esta ação removerá os dados da conta atual e todos seus extratos vinculados',
            title: 'Tem certeza?',
        })

    }
    const [isReportOpen, setIsReportOpen] = useState(false)
    const handleReport = () => {
        setIsReportOpen(prev => !prev)
    }
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true
            return
        }
        if (bankingInfo.isUser) {
            candidateService.updateIdentityInfo({ hasBankAccount: bankingInfo.hasBankAccount }).catch(_ => { })
        } else {
            candidateService.updateFamilyMember(id, { hasBankAccount: bankingInfo.hasBankAccount }).catch(_ => { })
        }
    }, [bankingInfo?.hasBankAccount])
    return (
        <>
            {isReportOpen ?
                <BankReport id={id} onBack={() => setIsReportOpen(false)} />
                : <>
                    <FormList.Root title={"Contas cadastradas"} isLoading={isLoading}>
                        <RowTextAction
                            text={'Relatório de contas e relacionamentos (CCS)'}
                            label={'visualizar'}
                            onClick={handleReport}
                        />
                        <FormList.List list={bankingInfo.accounts} text={`Nenhuma conta cadastrada, clique abaixo para realizar o primeiro cadastro`} render={(item) => {
                            return (
                                <FormListItem.Root text={item.bankName}>
                                    <FormListItem.Actions>
                                        <ButtonBase label={"visualizar"} onClick={() => onSelect(item)} />
                                        <ButtonBase label={"excluir"} onClick={() => handleRemove(item.id)} danger />
                                    </FormListItem.Actions>
                                </FormListItem.Root>
                            )
                        }}>
                            {bankingInfo?.accounts?.length === 0 && <CheckboxBase
                                label={'Você possui alguma conta em banco?'}
                                value={bankingInfo.hasBankAccount}
                                onChange={(e) => setBankingInfo(prev => ({ ...prev, hasBankAccount: e.target.value === "true" }))}
                            />}
                        </FormList.List>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '80%' }}>

                            <ButtonBase onClick={onBack}><Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>

                            {bankingInfo.hasBankAccount && <ButtonBase label={"cadastrar conta"} onClick={() => onAdd()} />}
                        </div>
                    </FormList.Root>
                </>
            }


        </>
    )
}