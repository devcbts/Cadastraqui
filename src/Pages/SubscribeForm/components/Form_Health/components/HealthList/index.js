import ButtonBase from "Components/ButtonBase";
import FormList from "../../../FormList";
import FormListItem from "../../../FormList/FormListItem";
import { useEffect, useState } from "react";
import candidateService from "services/candidate/candidateService";
import MemberHealthView from "../MemberHealthView";

export default function HealthList({ onSelect, onAdd }) {
    const [members, setMembers] = useState([])
    const [selectedMember, setSelectedMember] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const members = await candidateService.getHealthInfo()
                if (members) {
                    setMembers(members)
                }
            } catch (err) {

            }
        }
        fetchData()
    }, [])

    const handleSelect = (item) => {
        setSelectedMember(item)
    }
    return (
        <>
            {!selectedMember
                ? <FormList.Root title={"Saúde"} text={"Cadastre dados sobre a saúde de seu grupo familiar"}>
                    <FormList.List list={members} text="Cadastre um membro em seu grupo familiar antes de realizar o cadastro de saúde" render={(item) => (
                        <FormListItem.Root text={item.name}>
                            <FormListItem.Actions>
                                <ButtonBase label="visualizar" onClick={() => handleSelect(item)} />
                                {/* {!item.healthInfo && <ButtonBase label="cadastrar" onClick={() => onAdd(item)} />} */}
                            </FormListItem.Actions>
                        </FormListItem.Root>

                    )}>
                    </FormList.List>
                </FormList.Root>
                :
                <MemberHealthView member={selectedMember} onSelect={onSelect} onAdd={onAdd} />

            }
        </>

    )
}