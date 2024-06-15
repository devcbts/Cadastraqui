
import RowTextAction from "Components/RowTextAction"
import FormList from "Pages/SubscribeForm/components/FormList"
import FormListItem from "Pages/SubscribeForm/components/FormList/FormListItem"
import { useEffect, useState } from "react"
import { NotificationService } from "services/notification"
import BankReport from "../BankReport"
import ButtonBase from "Components/ButtonBase"
export default function MemberBankAccount({ id, onSelect }) {
    const [isLoading, setIsLoading] = useState(true)
    const [accounts, setAccounts] = useState([])
    // TODO: fetch bank account information from SPECIFIC USER
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                // const information = await candidateService.getBankingAccountById(id)
                // setAccounts(information)
            } catch (err) {

            }
            setIsLoading(false)
        }
        fetchData()
    }, [])

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
                        <FormList.List list={accounts} text={`Nenhuma conta cadastrada para este membro familiar`} render={(item) => {
                            return (
                                <FormListItem.Root text={item.bankName}>
                                    <FormListItem.Actions>
                                        <ButtonBase label={"visualizar"} onClick={() => onSelect(item)} />
                                    </FormListItem.Actions>
                                </FormListItem.Root>
                            )
                        }}>

                        </FormList.List>
                    </FormList.Root>
                </>
            }


        </>
    )
}