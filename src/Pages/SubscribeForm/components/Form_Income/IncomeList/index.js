import ButtonBase from "Components/ButtonBase";
import { useEffect, useMemo, useState } from "react";
import candidateService from "services/candidate/candidateService";
import FormList from "../../FormList";
import FormListItem from "../../FormList/FormListItem";
import MemberIncomeView from "../MemberIncomeView";
import styles from './styles.module.scss';
import { NotificationService } from "services/notification";
import Indicator from "Components/Indicator";
import useAuth from "hooks/useAuth";
import socialAssistantService from "services/socialAssistant/socialAssistantService";
import { useRecoilValue } from "recoil";
import candidateViewAtom from "Pages/SocialAssistant/SelectionProcess/CandidateView/atom/candidateViewAtom";

export default function IncomeList({ onSelect, onAdd, initialMember }) {

    const [isLoading, setIsLoading] = useState(true)
    const [members, setMembers] = useState([])
    const [selectedMember, setSelectedMember] = useState(initialMember)
    const { currentApplication } = useRecoilValue(candidateViewAtom)
    const { auth } = useAuth()
    const isAssistant = useMemo(() => auth.role === "ASSISTANT")
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const members = isAssistant ? await socialAssistantService.getAllIncomes(currentApplication) : await candidateService.getAllIncomes()
                if (members) {
                    console.log(members)
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
            setSelectedMember(initialMember)
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
                            <Indicator
                                status={item?.isUpdated}
                            />
                            <ButtonBase label={"visualizar"} onClick={() => setSelectedMember({ fullName: item.name, id: item.id, isUpdated: item.isUpdated })} />
                            {/* <ButtonBase label={"cadastrar"} onClick={() => onAdd({ member: { fullName: item.name, id: item.id } })} /> */}
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