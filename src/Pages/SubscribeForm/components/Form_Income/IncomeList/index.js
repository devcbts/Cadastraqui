import AIAnalysisIndicator from "Components/AIAnalysisIndicator";
import ButtonBase from "Components/ButtonBase";
import Indicator from "Components/Indicator";
import useSubscribeFormPermissions from "Pages/SubscribeForm/hooks/useSubscribeFormPermissions";
import { useEffect, useState } from "react";
import FormList from "../../FormList";
import FormListItem from "../../FormList/FormListItem";
import MemberIncomeView from "../MemberIncomeView";
import styles from './styles.module.scss';

export default function IncomeList({ onSelect, onAdd, initialMember }) {

    const [isLoading, setIsLoading] = useState(true)
    const [members, setMembers] = useState([])
    const [selectedMember, setSelectedMember] = useState(initialMember)
    const { service } = useSubscribeFormPermissions()
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const members = await service?.getAllIncomes()
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
                            <AIAnalysisIndicator
                                status={item?.analysisStatus}
                            />
                            <Indicator
                                status={item?.isIncomeUpdated}
                            />
                            <ButtonBase label={"visualizar"} onClick={() => setSelectedMember({ fullName: item.name, id: item.id })} />
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