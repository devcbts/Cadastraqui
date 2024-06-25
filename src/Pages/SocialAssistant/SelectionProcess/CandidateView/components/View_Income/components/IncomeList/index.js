import { useEffect, useState } from "react";
import ButtonBase from "Components/ButtonBase";
import InputBase from "Components/InputBase";
import socialAssistantService from "services/socialAssistant/socialAssistantService";
import FormList from "Pages/SubscribeForm/components/FormList";
import FormListItem from "Pages/SubscribeForm/components/FormList/FormListItem";
import MemberIncomeView from "../MemberIncomeView";

export default function IncomeList({ applicationId, onSelect }) {
    const [isLoading, setIsLoading] = useState(true)
    const [members, setMembers] = useState([])
    const [selectedMember, setSelectedMember] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const members = await socialAssistantService.getAllIncomes(applicationId)
                if (members) {
                    setMembers(members)
                }
            } catch (err) {

            }
            setIsLoading(false)
        }
        fetchData()
    }, [])
    return (
        <>
            {!selectedMember && <FormList.Root title={"Renda Familiar"} isLoading={isLoading} >
                <InputBase label="renda média familiar cadastrada" value={members?.avgFamilyIncome} disabled error={null} />
                <FormList.List list={members?.incomes} text={'Cadastre um membro em seu grupo familiar para cadastrar um tipo de renda'} render={(item) => (
                    <FormListItem.Root text={item.name}>
                        <FormListItem.Actions>
                            <ButtonBase label={"visualizar"} onClick={() => setSelectedMember({ fullName: item.name, id: item.id })} />
                        </FormListItem.Actions>
                    </FormListItem.Root>
                )}>

                </FormList.List>
            </FormList.Root>}
            {
                selectedMember &&
                <MemberIncomeView member={selectedMember} onSelect={(member) => onSelect(member)} applicationId={applicationId} />
            }
        </>
    )
}