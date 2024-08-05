import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from "react";
import candidateService from "services/candidate/candidateService";
import FormList from "../../FormList";
import FormListItem from "../../FormList/FormListItem";
import MemberIncomeView from "../MemberIncomeView";
import styles from './styles.module.scss';
import { NotificationService } from "services/notification";

export default function IncomeList({ onSelect, onAdd, initialMember }) {

    const [isLoading, setIsLoading] = useState(true)
    const [members, setMembers] = useState([])
    const [selectedMember, setSelectedMember] = useState(initialMember)
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const members = await candidateService.getAllIncomes()
                if (members) {
                    setMembers(members)
                }
            } catch (err) {

            }
            setIsLoading(false)
        }
        if (selectedMember === null) fetchData()
    }, [selectedMember])
    useEffect(() => {
        if (initialMember) {
            setSelectedMember({ fullName: initialMember?.name, id: initialMember?.id, isUpdated: initialMember?.isUpdated })
        }
    }, [initialMember])
    return (
        <>
            {!selectedMember && <FormList.Root title={"Renda Familiar"} isLoading={isLoading} >
                <div className={styles.divRendaMediaFamiliar}>
                    <label className={styles.titleRendaMediaFamiliar}>Renda média familiar cadastrada</label>
                    <spam className={styles.valoresRendaMediaFamiliar}>{members?.avgFamilyIncome}</spam>
                </div>
                {/* <InputBase label="renda média familiar cadastrada" value={members?.avgFamilyIncome} disabled error={null} /> */}
                <FormList.List list={members?.incomes} text={'Cadastre um membro em seu grupo familiar para cadastrar um tipo de renda'} render={(item) => (
                    <FormListItem.Root text={item.name}>
                        <FormListItem.Actions>
                            <ButtonBase label={"visualizar"} onClick={() => setSelectedMember({ fullName: item.name, id: item.id, isUpdated: item.isUpdated })} />
                            <ButtonBase label={"cadastrar"} onClick={() => onAdd({ member: { fullName: item.name, id: item.id } })} />
                        </FormListItem.Actions>
                    </FormListItem.Root>
                )}>

                </FormList.List>
                {/* <ButtonBase label={"cadastrar renda"} onClick={onAdd} /> */}
            </FormList.Root>}
            {
                selectedMember &&
                <MemberIncomeView member={selectedMember} onSelect={(member) => onSelect(member)} onAdd={onAdd} onBack={() => setSelectedMember(null)} />
            }
        </>
    )
}