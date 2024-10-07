import ButtonBase from "Components/ButtonBase";
import FormSelect from "Components/FormSelect";
import useControlForm from "hooks/useControlForm";
import FormList from "Pages/SubscribeForm/components/FormList";
import FormListItem from "Pages/SubscribeForm/components/FormList/FormListItem";
import { useEffect, useMemo, useState } from "react";
import entityService from "services/entity/entityService";
import assistantSelectionSchema from "./schemas/assistant-selection-schema";
import { NotificationService } from "services/notification";
import Modal from "Components/Modal";
import AssistantModal from "./components/AssistantModal";

export default function SocialAssistantSelection({ assistants = [], announcementId }) {
    const { control, formState: { isValid }, trigger, watch, getValues, reset } = useControlForm({
        schema: assistantSelectionSchema,
        defaultValues: {
            assistant: ""
        }
    })
    const [edit, setEdit] = useState(null)
    const [selection, setSelection] = useState(false)
    const [availableAssistants, setAvailableAssistants] = useState([])
    const [linkedAssistants, setLinkedAssistants] = useState([])
    const assistantOptions = useMemo(() => availableAssistants.filter((e) => !linkedAssistants.find((v) => v.id === e.id)).map(e => ({ label: e.name, value: e.id })), [linkedAssistants, availableAssistants])
    const handleSelection = () => {
        setSelection(prev => !prev)
    }

    const handleAdd = async () => {
        if (!isValid) {
            trigger()
            return
        }
        try {
            const value = getValues("assistant")
            await entityService.linkAssistantToAnnouncement(value, announcementId)
            NotificationService.success({ text: 'Assistente vinculado ao edital' })
            const currentAssistant = availableAssistants.find((e) => e.id === value)
            setLinkedAssistants((prev) => ([...prev, currentAssistant]))
            reset()
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }

    }
    const handleRemove = (item) => {
        const { id } = item
        NotificationService.confirm({
            title: 'Desvincular assistente?',
            onConfirm: async () => {
                try {
                    await entityService.removeAssistantFromAnnouncement(id, announcementId)
                    setLinkedAssistants((prev) => prev.filter(e => e.id !== id))
                } catch (err) {
                    NotificationService.error({ text: err?.response?.data?.message })
                }
            },
        })

    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const information = await entityService.getAvailableAssistants()
                setAvailableAssistants(information)
            } catch (err) { }
        }
        fetchData()
    }, [])
    useEffect(() => {
        setLinkedAssistants(availableAssistants.filter(e => assistants.find(v => v.id === e.id)))
    }, [availableAssistants, assistants])
    const handleEdit = (data) => {
        setEdit(data)
    }
    const handleAssistantUpdate = (data) => {
        const { id } = data
        setAvailableAssistants((prev) => ([...prev].map((e) => {
            if (e.id === id) {
                return data
            }
            return e
        })))
    }
    return (
        <div style={{ width: 'clamp(400px,30%,50%)', margin: '32px 0px' }}>
            <AssistantModal data={edit} onClose={() => handleEdit(null)} onUpdate={handleAssistantUpdate} />
            <h3>Assistentes Sociais</h3>
            <FormList.Root>
                <FormList.List list={linkedAssistants} text={'Ainda não existem assistentes sociais para este edital'} render={(item) => {
                    return (
                        <FormListItem.Root key={item.id} text={item.name}>
                            <FormListItem.Actions>
                                <ButtonBase label={'editar'} onClick={() => handleEdit(item)} />
                                <ButtonBase label={'excluir'} danger onClick={() => handleRemove(item)} />
                            </FormListItem.Actions>
                        </FormListItem.Root>
                    )
                }}>
                </FormList.List>
                <div style={{ marginTop: '16px' }}>
                    <ButtonBase label={selection ? 'esconder seleção' : 'mostrar seleção'} onClick={handleSelection} />
                </div>
                {selection && (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '12px' }}>
                        <div style={{ width: '100%' }}>
                            <FormSelect
                                control={control}
                                name="assistant"
                                label={'assistente'}
                                options={assistantOptions}
                                value={watch("assistant")}
                            />
                        </div>
                        <ButtonBase label={'vincular'} onClick={handleAdd} />
                    </div>
                )}
            </FormList.Root>
        </div>
    )
}