import ButtonBase from "Components/ButtonBase"
import FormList from "Pages/SubscribeForm/components/FormList"
import FormListItem from "Pages/SubscribeForm/components/FormList/FormListItem"
import { useEffect, useState } from "react"
import candidateService from "services/candidate/candidateService"
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
    return (
        <>
            <FormList.Root title={"Contas cadastradas"} isLoading={isLoading}>
                <FormList.List list={accounts} text={`Nenhuma conta cadastrada, clique abaixo para realizar o primeiro cadastro`} render={(item) => {
                    return (
                        <FormListItem.Root text={item.bankName}>
                            <FormListItem.Actions>
                                <ButtonBase label={"visualizar"} onClick={() => onSelect(item)} />
                                <ButtonBase label={"excluir"} onClick={onRemove} danger />
                            </FormListItem.Actions>
                        </FormListItem.Root>
                    )
                }}>

                </FormList.List>
                <ButtonBase label={"cadastrar conta"} onClick={() => onAdd()} />
            </FormList.Root>


        </>
    )
}