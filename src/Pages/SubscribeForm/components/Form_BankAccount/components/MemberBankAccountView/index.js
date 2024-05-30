import ButtonBase from "Components/ButtonBase"
import RowTextAction from "Components/RowTextAction"
import FormList from "Pages/SubscribeForm/components/FormList"
import FormListItem from "Pages/SubscribeForm/components/FormList/FormListItem"
import { useEffect, useState } from "react"
import candidateService from "services/candidate/candidateService"
import BankReport from "../BankReport"
import { api } from "services/axios"
import { NotificationService } from "services/notification"
export default function MemberBankAccountView({ id, onSelect, onRemove, onAdd }) {
    const [isLoading, setIsLoading] = useState(true)
    const [accounts, setAccounts] = useState([])
    // TODO: fetch bank account information from SPECIFIC USER
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const information = await candidateService.getBankingAccountById(id)
                setAccounts(information)
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
                setAccounts((prev) => prev.filter(account => account.id !== id))
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
    return (
        <>
            {isReportOpen ?
                <BankReport id={id} />
                : <>
                    <RowTextAction
                        text={'relatório de contas e relacionamentos (CCS)'}
                        label={'visualizar'}
                        onClick={handleReport}
                    />
                    <FormList.Root title={"Contas cadastradas"} isLoading={isLoading}>
                        <FormList.List list={accounts} text={`Nenhuma conta cadastrada, clique abaixo para realizar o primeiro cadastro`} render={(item) => {
                            return (
                                <FormListItem.Root text={item.bankName}>
                                    <FormListItem.Actions>
                                        <ButtonBase label={"visualizar"} onClick={() => onSelect(item)} />
                                        <ButtonBase label={"excluir"} onClick={() => handleRemove(item.id)} danger />
                                    </FormListItem.Actions>
                                </FormListItem.Root>
                            )
                        }}>

                        </FormList.List>
                        <ButtonBase label={"cadastrar conta"} onClick={() => onAdd()} />
                    </FormList.Root>
                </>
            }


        </>
    )
}