import ButtonBase from "Components/ButtonBase";
import FormList from "../../../FormList";
import FormListItem from "../../../FormList/FormListItem";
import { useEffect, useState } from "react";
import candidateService from "services/candidate/candidateService";

export default function HealthList({ onSelect, onAdd }) {
    const [members, setMembers] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const members = await candidateService.getFamilyMembers()

                if (members) {
                    setMembers(members)
                }
            } catch (err) {

            }
        }
        fetchData()
    }, [])
    return (
        <FormList.Root title={"Saúde"} text={"Cadastre dados sobre a saúde de seu grupo familiar"}>
            <FormList.List list={members} text="Cadastre um membro em seu grupo familiar antes de realizar o cadastro de saúde" render={(item) => (
                <FormListItem.Root text={item.fullName}>
                    <FormListItem.Actions>
                        <ButtonBase label="visualizar" onClick={onSelect} />
                        <ButtonBase label="cadastrar" onClick={onAdd} />
                    </FormListItem.Actions>
                </FormListItem.Root>

            )}>
            </FormList.List>
        </FormList.Root>
    )
}