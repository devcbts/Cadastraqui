
import ButtonBase from "Components/ButtonBase";
import HealthFiles from "Pages/SubscribeForm/components/Form_Health/components/HealthFiles";
import MemberHealthView from "Pages/SubscribeForm/components/Form_Health/components/MemberHealthView";
import FormList from "Pages/SubscribeForm/components/FormList";
import FormListItem from "Pages/SubscribeForm/components/FormList/FormListItem";
import { useState } from "react";
import removeObjectFileExtension from "utils/remove-file-ext";

export default function HealthList({ loading, data, onSelect }) {
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
                    ? <MemberHealthView member={selectedMember} onViewFiles={handleFileSelection} onSelect={onSelect} edit={false} onBack={() => handleSelect(null)} />
                    : <HealthFiles edit={false} items={files} onBack={() => setFiles(null)} />)
            }
        </>

    )
}