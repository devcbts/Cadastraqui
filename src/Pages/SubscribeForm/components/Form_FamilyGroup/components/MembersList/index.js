import ButtonBase from "Components/ButtonBase";
import CheckboxBase from "Components/CheckboxBase";
import FormList from "Pages/SubscribeForm/components/FormList";
import { useEffect, useRef, useState } from "react";
import candidateService from "services/candidate/candidateService";
import { NotificationService } from "services/notification";
import MemberCard from "./components/MemberCard";
import useSubscribeFormPermissions from "Pages/SubscribeForm/hooks/useSubscribeFormPermissions";
import FormListItem from "Pages/SubscribeForm/components/FormList/FormListItem";
export default function MembersList({ onSelect, onAdd }) {
    const [familyMembers, setFamilyMembers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [livesAlone, setLivesAlone] = useState(null)
    const { canEdit, service } = useSubscribeFormPermissions()

    const firstRender = useRef(true)
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const familyGroup = await service?.getFamilyMembers()
                if (familyGroup) {
                    setFamilyMembers(familyGroup.members)
                    setLivesAlone(familyGroup.livesAlone)
                }
            } catch (err) {

                NotificationService.error({ text: err?.response?.data?.message })
            }
            setIsLoading(false)
        }
        fetchData()
    }, [])
    useEffect(() => {
        if (!canEdit) {
            return
        }
        if (firstRender.current) {
            return
        }
        candidateService.updateIdentityInfo({ livesAlone: livesAlone }).then(_ => NotificationService.success({ text: 'Informação alterada', type: "toast" })
        ).catch(_ => { })
        candidateService.updateRegistrationProgress('grupoFamiliar', livesAlone)
    }, [livesAlone])
    const handleDeleteMember = async (id) => {
        setIsLoading(true)
        try {
            await candidateService.deleteFamilyMember(id)
            setFamilyMembers((prevState) => prevState.filter(member => member.id !== id))
        } catch (err) {
            NotificationService.error({ text: err.response.data.message })
        }
        setIsLoading(false)
    }

    const handleConfirmDelete = async (id) => {
        await NotificationService.confirm({
            title: "Tem certeza?",
            text: "Esta ação não poderá ser desfeita",
            onConfirm: async () => await handleDeleteMember(id),
        })
    }
    const handleSelectMember = (id) => {
        const member = familyMembers.find(m => m.id === id)
        onSelect(member)
    }
    const handleLivesAlone = (e) => {
        firstRender.current = false
        setLivesAlone(e.target.value === "true")
    }
    return (
        <>
            <FormList.Root isLoading={isLoading} text={'Selecione um parente ou cadastre um novo'} title={'Integrantes do Grupo Familiar'}>
                {(!livesAlone && canEdit) && <ButtonBase
                    label="adicionar"
                    onClick={onAdd}
                />
                }
                <FormList.List list={familyMembers} text='Você ainda não registrou nenhum membro para o grupo familiar, clique no botão abaixo para realizar o primeiro cadastro' render={(item) => (
                    <FormListItem.Root text={item.fullName}>
                        <FormListItem.Actions>
                            <ButtonBase label={"visualizar"} onClick={() => handleSelectMember(item.id)} />
                            {canEdit && <ButtonBase label={"excluir"} danger onClick={() => handleConfirmDelete(item.id)} />}
                        </FormListItem.Actions>
                    </FormListItem.Root>
                )} >
                    {(livesAlone || familyMembers.length === 0) ? <CheckboxBase
                        onChange={handleLivesAlone}
                        value={livesAlone}
                        label={'Você mora sozinho?'}
                        disabled={!canEdit}
                    /> : null}
                </FormList.List>
            </FormList.Root>
        </>
    )
}