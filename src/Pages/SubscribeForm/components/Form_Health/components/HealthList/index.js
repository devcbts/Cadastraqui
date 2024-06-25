import ButtonBase from "Components/ButtonBase";
import FormList from "../../../FormList";
import FormListItem from "../../../FormList/FormListItem";
import { useEffect, useState } from "react";
import candidateService from "services/candidate/candidateService";
import MemberHealthView from "../MemberHealthView";
import HealthFiles from "../HealthFiles";
import removeObjectFileExtension from "utils/remove-file-ext";

export default function HealthList({ loading, data, onSelect, onAdd }) {
    const [selectedMember, setSelectedMember] = useState(null)
    const handleSelect = (item) => {
        setSelectedMember(item)
    }
    const [files, setFiles] = useState(null)
    const handleFileSelection = (type, obj) => {
        if (files) {
            setFiles(null)
            return
        }
        const deleteUrl = Object.keys(obj.urls)[0]
        const urls = removeObjectFileExtension(obj.urls)
        // obj contains {name, urls}
        setFiles({ type, memberId: selectedMember.id, ...{ ...obj, urls, deleteUrl } })
    }
    return (
        <>
            {!selectedMember
                ? <FormList.Root isLoading={loading} title={"Saúde"} text={"Cadastre dados sobre a saúde de seu grupo familiar"}>
                    <FormList.List list={data} text="Cadastre um membro em seu grupo familiar antes de realizar o cadastro de saúde" render={(item) => (
                        <FormListItem.Root text={item.name}>
                            <FormListItem.Actions>
                                <ButtonBase label="visualizar" onClick={() => handleSelect(item)} />
                            </FormListItem.Actions>
                        </FormListItem.Root>

                    )}>
                    </FormList.List>
                </FormList.Root>
                : (!files
                    ? <MemberHealthView member={selectedMember} onViewFiles={handleFileSelection} onSelect={onSelect} onAdd={onAdd} />
                    : <HealthFiles items={files} />)
            }
        </>

    )
}